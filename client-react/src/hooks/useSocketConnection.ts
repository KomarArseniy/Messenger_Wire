import { useEffect } from 'react';
import { connectSocket } from '@/lib/socket';

export function useSocketConnection(userId: number | undefined) {
  useEffect(() => {
    if (userId === undefined) return;

    connectSocket(userId);
  }, [userId]);
}
