export type MessageStatus = 'sending' | 'sent' | 'read' | 'error';

export interface Message {
  id: number;
  content: string;
  created_at: string;
  sender_id: number;
  avatar_url: string | null;
  full_name: string | null;
  is_read?: boolean;
  status?: MessageStatus;
  tempId?: string;
}

export interface MessagesResponse {
  success: boolean;
  messages: Message[];
}
