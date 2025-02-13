import { create } from 'zustand';

interface KickedState {
  kicked: boolean;
  setKicked(kicked: boolean): void;
  reset(): void;
}

export const useKickedStore = create<KickedState>((set) => ({
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
