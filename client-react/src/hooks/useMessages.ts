import { useQuery } from '@tanstack/react-query';
import { getMessages } from '@/api/chatApi';
import { queryKeys } from '@/lib/queryKeys';
import { useSessionStore } from '@/store/sessionStore';
import type { Message } from '@/types/message';

export function useMessages(chatId: number | null) {
  const myId = useSessionStore((s) => s.user?.id);

  return useQuery({
    queryKey: chatId ? queryKeys.messages(chatId) : ['messages', 'none'],
    queryFn: async () => {
      const res = await getMessages(chatId!);
      return res.messages.map((msg): Message => {
        if (msg.sender_id !== myId) return msg;
        return { ...msg, status: msg.is_read ? 'read' : 'sent' };
      });
    },
    enabled: chatId !== null,
  });
}
