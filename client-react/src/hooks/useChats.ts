import { useQuery } from '@tanstack/react-query';
import { getChats } from '@/api/chatApi';
import { queryKeys } from '@/lib/queryKeys';

export function useChats() {
  return useQuery({
    queryKey: queryKeys.chats,
    queryFn: async () => {
      const res = await getChats();
      return res.chats;
    },
  });
}
