import { useEffect, useState } from 'react';
import { connectSocket, getSocket } from '@/lib/socket';

export function useSocketConnection(userId: number | undefined) {
  const [isConnected, setIsConnected] = useState(
    () => getSocket()?.connected ?? false,
  );

  useEffect(() => {
    if (userId === undefined) return;

    const socket = connectSocket(userId);

    const onConnect = () => setIsConnected(true);
    const onDisconnect = () => setIsConnected(false);

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    };
  }, [userId]);

  return isConnected;
}
