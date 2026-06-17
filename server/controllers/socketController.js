import {getChatMessages, getUserChats} from "./chatControllers.js";
import { createMessage } from "./chatControllers.js";
import { createUnreadMessage } from "./chatControllers.js";
import { createUserChat } from "./chatControllers.js";
import { getUserByID } from "../models/authModel.js";
import ChatModel from "../models/chatModel.js";
import { TokenService } from "../services/TokenService.js";

const tokenService = new TokenService();

export function configureSockets(io) {
    let users = {}
    let userCache = new Map();

    // Миддлваре: проверяем JWT при подключении сокета
    io.use((socket, next) => {
        const token = socket.handshake.auth?.token;
        if (!token) {
            return next(new Error('unauthorized'));
        }
        try {
            const payload = tokenService.verifyAccessToken(token);
            socket.userId = payload.id;
            next();
        } catch {
            next(new Error('unauthorized'));
        }
    });

    io.on('connection', socket => {
        users[socket.userId] = socket.id;

        // Отмечаем онлайн и уведомляем собеседников
        (async () => {
            try {
                const chatIds = await ChatModel.getUserChatIds(socket.userId);
                for (const chatId of chatIds) {
                    socket.join(chatId);
                }

                await ChatModel.setUserOnline(socket.userId, true);
                const partnerIds = await ChatModel.getChatPartnerIds(socket.userId);
                for (const partnerId of partnerIds) {
                    const partnerSocketId = users[partnerId];
                    if (partnerSocketId) {
                        io.to(partnerSocketId).emit('presence', {
                            userId: socket.userId,
                            isOnline: true,
                        });
                    }
                }
            } catch (error) {
                console.error('Ошибка установки онлайн-статуса:', error);
            }
        })();

        socket.on('join_room', async (room, callback) => {
            socket.join(room);
            if (typeof callback === 'function') callback(room);
        })

        // Присоединить всех участников чата к комнате (после создания чата)
        socket.on('join_chat', async (chatId, callback) => {
            try {
                const memberIds = await ChatModel.getChatMemberIds(chatId);
                for (const memberId of memberIds) {
                    const memberSocketId = users[memberId];
                    if (memberSocketId) {
                        io.sockets.sockets.get(memberSocketId)?.join(chatId);
                    }
                }
                if (typeof callback === 'function') callback({ success: true });
            } catch (error) {
                console.error('Ошибка join_chat:', error);
                if (typeof callback === 'function') callback({ success: false });
            }
        })

        socket.on("chat_history", async (room, callback) => {
            let messages = null;
            if (room) {
                messages = await getChatMessages(room);
            }
            callback(messages);
        });

        socket.on("create_room", (room) => {

        })

        // Обработка отправки сообщений
        socket.on("send_message", async (data, callback) => {
            const { chatId, isGroupChat, content, created_at } = data;
            const sender_id = socket.userId;
            try {
                let full_name = null;
                let avatar_url = null;

                const message = await createMessage(chatId, sender_id, content, created_at);

                try {
                    const memberIds = await ChatModel.getChatMemberIds(chatId);
                    for (const memberId of memberIds) {
                        if (memberId !== sender_id) {
                            await createUnreadMessage(chatId, memberId, message.id);
                        }
                    }
                } catch (unreadErr) {
                    console.error('Ошибка создания непрочитанных:', unreadErr);
                }

                if (isGroupChat) {
                    if (userCache.has(sender_id)) {
                        const cachedUser = userCache.get(sender_id);
                        full_name = cachedUser.full_name;
                        avatar_url = cachedUser.avatar_url;
                    } else {
                        const user = await getUserByID(sender_id);
                        if (user) {
                            full_name = user.full_name;
                            avatar_url = user.avatar_url;
                            userCache.set(sender_id, { full_name, avatar_url });
                        }
                    }
                }

                socket.to(chatId).emit("new_message", {
                    chatId,
                    isGroupChat,
                    message: {
                        id: message.id,
                        sender_id,
                        content,
                        created_at,
                        full_name,
                        avatar_url
                    },
                });
                console.log(`Сообщение от ${sender_id} для ${chatId}: ${content}`);

                if (typeof callback === 'function') {
                    callback({
                        success: true,
                        message: {
                            id: message.id,
                            created_at: message.created_at,
                        },
                    });
                }
            } catch (error) {
                console.error('Ошибка отправки сообщения:', error);
                if (typeof callback === 'function') {
                    callback({ success: false, error: 'Не удалось отправить сообщение' });
                }
            }
        })

        socket.on('notification', async (data, callback) => {
            const {chatId, destUserId , messageId } = data;
            try {
                await createUnreadMessage(chatId, destUserId, messageId);
                callback(data);
            } catch (error) {
                console.error('Ошибка отправки уведомления:', error);
            }
        })

        socket.on('mark_read', async (data, callback) => {
            const { chatId } = data;
            const readerId = socket.userId;
            try {
                const messageIds = await ChatModel.markChatMessagesRead(chatId, readerId);
                socket.to(chatId).emit('messages_read', { chatId, messageIds });
                if (typeof callback === 'function') {
                    callback({ success: true, messageIds });
                }
            } catch (error) {
                console.error('Ошибка отметки прочтения:', error);
                if (typeof callback === 'function') {
                    callback({ success: false });
                }
            }
        })

        socket.on("disconnect", async () => {
            for (const [userId, socketId] of Object.entries(users)) {
                if (socketId === socket.id) delete users[userId];
            }

            try {
                await ChatModel.setUserOnline(socket.userId, false);
                const partnerIds = await ChatModel.getChatPartnerIds(socket.userId);
                for (const partnerId of partnerIds) {
                    const partnerSocketId = users[partnerId];
                    if (partnerSocketId) {
                        io.to(partnerSocketId).emit('presence', {
                            userId: socket.userId,
                            isOnline: false,
                        });
                    }
                }
            } catch (error) {
                console.error('Ошибка сброса онлайн-статуса:', error);
            }
        });

    })

}