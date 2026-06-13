import { io, Socket } from 'socket.io-client';
import { API_BASE_URL } from './config';
import type {
  ServerToClientEvents,
  ClientToServerEvents,
  SendMessagePayload,
  SendMessageAck,
} from '@/types/socket';

type AppSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

let socket: AppSocket | null = null;

export function connectSocket(token: string): AppSocket {
  if (socket) return socket;

  socket = io(API_BASE_URL, {
    transports: ['websocket'],
    autoConnect: true,
    auth: { token },
  });

  return socket;
}

export function reconnectSocket(token: string) {
  if (!socket) return;
  socket.auth = { token };
  socket.disconnect().connect();
}

export function getSocket(): AppSocket | null {
  return socket;
}

export function joinRoom(chatId: number) {
  return new Promise<number>((resolve) => {
    if (!socket) return resolve(chatId);
    socket.emit('join_room', chatId, (room) => resolve(room));
  });
}

export function sendMessage(payload: SendMessagePayload, timeoutMs = 10000) {
  return new Promise<SendMessageAck>((resolve, reject) => {
    if (!socket) return reject(new Error('no socket'));

    const timer = setTimeout(() => reject(new Error('timeout')), timeoutMs);

    socket.emit('send_message', payload, (ack) => {
      clearTimeout(timer);
      if (ack?.success) resolve(ack);
      else reject(new Error(ack?.error ?? 'send failed'));
    });
  });
}

export function markRead(chatId: number) {
  socket?.emit('mark_read', { chatId });
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
