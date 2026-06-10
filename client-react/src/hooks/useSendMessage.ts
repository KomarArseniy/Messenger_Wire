import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { sendMessage } from '@/lib/socket';
import { queryKeys } from '@/lib/queryKeys';
import { useSessionStore } from '@/store/sessionStore';
import type { Message } from '@/types/message';

export function useSendMessage(chatId: number | null) {
  const queryClient = useQueryClient();
  const user = useSessionStore((s) => s.user);

  return useCallback(
    async (content: string, isGroupChat = false) => {
      const text = content.trim();
      if (!text || chatId === null || !user) return;

      const tempId = crypto.randomUUID();
      const createdAt = new Date().toISOString();
      const key = queryKeys.messages(chatId);

      const optimistic: Message = {
        id: -1,
        tempId,
        content: text,
        created_at: createdAt,
        sender_id: user.id,
        avatar_url: null,
        full_name: null,
        status: 'sending',
      };

      queryClient.setQueryData<Message[]>(key, (old = []) => [
        ...old,
        optimistic,
      ]);

      const patch = (updater: (m: Message) => Message) => {
        queryClient.setQueryData<Message[]>(key, (old = []) =>
          old.map((m) => (m.tempId === tempId ? updater(m) : m)),
        );
      };

      try {
        const ack = await sendMessage({
          sender_id: user.id,
          chatId,
          isGroupChat,
          content: text,
          created_at: createdAt,
        });
        patch((m) => ({
          ...m,
          id: ack.message?.id ?? m.id,
          status: 'sent',
        }));
      } catch {
        patch((m) => ({ ...m, status: 'error' }));
      }
    },
    [chatId, user, queryClient],
  );
}
