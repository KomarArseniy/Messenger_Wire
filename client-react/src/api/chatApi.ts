import { request } from '@/lib/httpClient';
import type { ChatsResponse } from '@/types/chat';
import type { MessagesResponse } from '@/types/message';
import type { SearchUserResponse, CreateChatResponse } from '@/types/search';

export function getChats() {
  return request<ChatsResponse>('/api/user/chats', { auth: true });
}

export function getMessages(chatId: number, limit = 50, offset = 0) {
  return request<MessagesResponse>(
    `/api/user/chats/${chatId}/messages?limit=${limit}&offset=${offset}`,
    { auth: true },
  );
}

export function searchUser(username: string) {
  return request<SearchUserResponse>(
    `/api/user/search?username=${encodeURIComponent(username)}`,
    { auth: true },
  );
}

export function createPrivateChat(userId: number) {
  return request<CreateChatResponse>('/api/user/chats', {
    method: 'POST',
    auth: true,
    body: JSON.stringify({ type: 'private', members: [userId] }),
  });
}
