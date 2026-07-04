import type { Message } from './message';

export interface SendMessagePayload {
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

export interface PresenceEvent {
  userId: number;
  isOnline: boolean;
}

export interface ServerToClientEvents {
  new_message: (event: NewMessageEvent) => void;
  messages_read: (event: MessagesReadEvent) => void;
  presence: (event: PresenceEvent) => void;
}

export interface ClientToServerEvents {
  join_room: (room: number, callback: (room: number) => void) => void;
  join_chat: (
    chatId: number,
    callback?: (ack: { success: boolean }) => void,
  ) => void;
  send_message: (
    payload: SendMessagePayload,
    callback: (ack: SendMessageAck) => void,
  ) => void;
  mark_read: (
    payload: { chatId: number },
    callback?: (ack: { success: boolean; messageIds?: number[] }) => void,
  ) => void;
}
