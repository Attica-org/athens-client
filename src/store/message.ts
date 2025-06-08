import { create } from 'zustand';

interface State {
  shouldGoDown: boolean;
  adjustScroll: boolean;
}

interface Action {
  setGoDown(bool: boolean): void;
  setAdjustScroll(bool: boolean): void;
  reset(): void;
}

const initialState: State = {
  shouldGoDown: false,
  adjustScroll: false,
};

export const useMessageStore = create<State & Action>((set) => ({
  ...initialState,
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
