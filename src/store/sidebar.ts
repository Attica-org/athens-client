import { create } from 'zustand';

interface State {
  isOpen: boolean;
  hamburgerButtonRef: React.RefObject<HTMLButtonElement> | null;
}

interface Action {
  setHanburgerButtonRef: (target: React.RefObject<HTMLButtonElement>) => void;
  toggle: () => void;
  close: () => void;
  reset: () => void;
}

const initialState: State = {
  isOpen: false,
  hamburgerButtonRef: null,
};

export const useSidebarStore = create<State & Action>((set) => ({
  ...initialState,
  setHanburgerButtonRef: (target) => {
    set({ hamburgerButtonRef: target });
  },
  toggle: () =>
    set((state: { isOpen: boolean }) => ({ isOpen: !state.isOpen })),
  close: () => set({ isOpen: false }),
  reset: () => set({ isOpen: false }),
}));
