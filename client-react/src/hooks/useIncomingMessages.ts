import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { getSocket } from '@/lib/socket';
import { queryKeys } from '@/lib/queryKeys';
import type { Message } from '@/types/message';
import type { NewMessageEvent, MessagesReadEvent } from '@/types/socket';

export function useIncomingMessages(isConnected: boolean) {
  const queryClient = useQueryClient();

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    function handleNewMessage(event: NewMessageEvent) {
      const { chatId, message } = event;
      const key = queryKeys.messages(chatId);

      queryClient.setQueryData<Message[]>(key, (old) => {
        if (!old) return old;
        if (old.some((m) => m.id === message.id)) return old;
        return [...old, message];
      });

      queryClient.invalidateQueries({ queryKey: queryKeys.chats });
    }

    function handleMessagesRead(event: MessagesReadEvent) {
      const { chatId, messageIds } = event;
      const key = queryKeys.messages(chatId);
      const readSet = new Set(messageIds);

      queryClient.setQueryData<Message[]>(key, (old) => {
        if (!old) return old;
        return old.map((m) =>
          readSet.has(m.id) && m.status ? { ...m, status: 'read' } : m,
        );
      });
    }

    socket.on('new_message', handleNewMessage);
    socket.on('messages_read', handleMessagesRead);

    return () => {
      socket.off('new_message', handleNewMessage);
      socket.off('messages_read', handleMessagesRead);
    };
  }, [queryClient, isConnected]);
}
