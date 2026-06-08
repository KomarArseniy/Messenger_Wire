export interface Message {
  id: number;
  content: string;
  created_at: string;
  sender_id: number;
  avatar_url: string | null;
  full_name: string | null;
}

export interface MessagesResponse {
  success: boolean;
  messages: Message[];
}
