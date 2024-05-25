import { create } from 'zustand';

interface MessageState {
  shouldGoDown: boolean;
  adjustScroll: boolean;
  setGoDown(bool: boolean): void;
  setAdjustScroll(bool: boolean): void;
  reset(): void;
}
// eslint-disable-next-line import/prefer-default-export
export const useMessageStore = create<MessageState>((set) => ({
  shouldGoDown: false,
  adjustScroll: false,
  setGoDown: (bool) => {
    set({ shouldGoDown: bool });
  },
  setAdjustScroll: (bool) => {
    set({ adjustScroll: bool });
  },
  reset: () => {
    set({
      shouldGoDown: false,
    });
  },
}));
