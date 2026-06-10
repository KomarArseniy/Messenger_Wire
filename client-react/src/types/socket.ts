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

export interface ServerToClientEvents {
  new_message: (event: NewMessageEvent) => void;
}

export interface ClientToServerEvents {
  authenticate: (userId: number) => void;
  join_room: (room: number, callback: (room: number) => void) => void;
  send_message: (
    payload: SendMessagePayload,
    callback: (ack: SendMessageAck) => void,
  ) => void;
}
