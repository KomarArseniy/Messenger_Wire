import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createPrivateChat } from '@/api/chatApi';
import { queryKeys } from '@/lib/queryKeys';

export function useCreatePrivateChat() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: number) => createPrivateChat(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.chats });
    },
  });
}
