export interface SearchedUser {
  id: number;
  username: string | null;
  avatar_url: string | null;
  status: string;
  fullname: string | null;
}

export interface SearchUserResponse {
  success: boolean;
  userData?: SearchedUser;
  error?: string;
}

export interface CreateChatResponse {
  success?: boolean;
  chatId?: number;
  exists?: boolean;
  type?: string;
  message?: string;
}
