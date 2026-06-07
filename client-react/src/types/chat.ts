export interface Chat {
  id: number;
  name: string | null;
  isGroup: boolean;
  avatar: string | null;
  lastActivity: string | null;
  lastMessage: string | null;
  isOnline: boolean;
  unreadCount: number;
}

export interface ChatsResponse {
  success: boolean;
  chats: Chat[];
}
