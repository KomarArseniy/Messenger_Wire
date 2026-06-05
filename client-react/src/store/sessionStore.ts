import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/types/user';

interface SessionState {
  accessToken: string | null;
  user: User | null;
  setSession: (accessToken: string, user: User) => void;
  setAccessToken: (accessToken: string) => void;
  clearSession: () => void;
  isAuthenticated: () => boolean;
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      user: null,
      setSession: (accessToken, user) => set({ accessToken, user }),
      setAccessToken: (accessToken) => set({ accessToken }),
      clearSession: () => set({ accessToken: null, user: null }),
      isAuthenticated: () => get().accessToken !== null,
    }),
    { name: 'wire-session' },
  ),
);
