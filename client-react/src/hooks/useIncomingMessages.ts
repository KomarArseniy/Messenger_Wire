import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { getSocket } from '@/lib/socket';
import { queryKeys } from '@/lib/queryKeys';
import type { Message } from '@/types/message';
import type { NewMessageEvent } from '@/types/socket';

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
        return [...old, { ...message, status: 'sent' }];
      });

      queryClient.invalidateQueries({ queryKey: queryKeys.chats });
    }

    socket.on('new_message', handleNewMessage);

    return () => {
      socket.off('new_message', handleNewMessage);
    };
  }, [queryClient, isConnected]);
}
