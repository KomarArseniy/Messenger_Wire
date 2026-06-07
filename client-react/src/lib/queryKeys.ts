export const queryKeys = {
  chats: ['chats'] as const,
  messages: (chatId: number) => ['messages', chatId] as const,
};
