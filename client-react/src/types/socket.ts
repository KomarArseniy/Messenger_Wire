import type { Message } from './message';

export interface SendMessagePayload {
  sender_id: number;
  chatId: number;
  isGroupChat: boolean;
  content: string;
  created_at: string;
}

export interface SendMessageAck {
  success: boolean;
  message?: {
    id: number;
    created_at: string;
  };
  error?: string;
}

export interface NewMessageEvent {
  chatId: number;
  isGroupChat: boolean;
  message: Message;
}

export interface MessagesReadEvent {
  chatId: number;
  messageIds: number[];
}

export interface ServerToClientEvents {
  new_message: (event: NewMessageEvent) => void;
  messages_read: (event: MessagesReadEvent) => void;
}

export interface ClientToServerEvents {
  authenticate: (userId: number) => void;
  join_room: (room: number, callback: (room: number) => void) => void;
  send_message: (
    payload: SendMessagePayload,
    callback: (ack: SendMessageAck) => void,
  ) => void;
  mark_read: (
    payload: { chatId: number; readerId: number },
    callback?: (ack: { success: boolean; messageIds?: number[] }) => void,
  ) => void;
}
