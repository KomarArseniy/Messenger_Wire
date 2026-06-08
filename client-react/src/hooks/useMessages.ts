import { useQuery } from '@tanstack/react-query';
import { getMessages } from '@/api/chatApi';
import { queryKeys } from '@/lib/queryKeys';

export function useMessages(chatId: number | null) {
  return useQuery({
    queryKey: chatId ? queryKeys.messages(chatId) : ['messages', 'none'],
    queryFn: async () => {
      const res = await getMessages(chatId!);
      return res.messages;
    },
    enabled: chatId !== null,
  });
}
