import { io, Socket } from 'socket.io-client';
import { API_BASE_URL } from './config';
import type {
  ServerToClientEvents,
  ClientToServerEvents,
} from '@/types/socket';

type AppSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

let socket: AppSocket | null = null;

export function connectSocket(userId: number): AppSocket {
  if (socket) return socket;

  socket = io(API_BASE_URL, {
    transports: ['websocket'],
    autoConnect: true,
  });

  socket.on('connect', () => {
    socket?.emit('authenticate', userId);
  });

  return socket;
}

export function getSocket(): AppSocket | null {
  return socket;
}

export function joinRoom(chatId: number) {
  return new Promise<number>((resolve) => {
    if (!socket) return resolve(chatId);
    socket.emit('join_room', chatId, (room) => resolve(room));
  });
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
