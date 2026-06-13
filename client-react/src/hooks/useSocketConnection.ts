import { useEffect, useState } from 'react';
import { connectSocket, getSocket, reconnectSocket } from '@/lib/socket';

export function useSocketConnection(token: string | null) {
  const [isConnected, setIsConnected] = useState(
    () => getSocket()?.connected ?? false,
  );

  useEffect(() => {
    if (!token) return;

    const existing = getSocket();
    if (existing) {
      reconnectSocket(token);
    }
    const socket = existing ?? connectSocket(token);

    const onConnect = () => setIsConnected(true);
    const onDisconnect = () => setIsConnected(false);

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    };
  }, [token]);

  return isConnected;
}
