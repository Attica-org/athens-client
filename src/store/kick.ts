import { create } from 'zustand';

interface State {
  kicked: boolean;
}

interface Action {
  setKicked(kicked: boolean): void;
  reset(): void;
}

export const useKickedStore = create<State & Action>((set) => ({
  kicked: false,
  setKicked: (kicked) => {
    set({ kicked });
  },
  reset: () => {
    set({
      kicked: false,
    });
  },
}));
