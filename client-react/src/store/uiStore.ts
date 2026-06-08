import { create } from 'zustand';

interface UiState {
  activeChatId: number | null;
  setActiveChatId: (chatId: number | null) => void;
}

export const useUiStore = create<UiState>((set) => ({
  activeChatId: null,
  setActiveChatId: (chatId) => set({ activeChatId: chatId }),
}));
