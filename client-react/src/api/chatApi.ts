import { request } from '@/lib/httpClient';
import type { ChatsResponse } from '@/types/chat';

export function getChats() {
  return request<ChatsResponse>('/api/user/chats', { auth: true });
}
