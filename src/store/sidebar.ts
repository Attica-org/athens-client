import { create } from 'zustand';

interface SidebarState {
  isOpen: boolean;
  hamburgerButtonRef: React.RefObject<HTMLButtonElement> | null;
  setHanburgerButtonRef: (target: React.RefObject<HTMLButtonElement>) => void;
  toggle: () => void;
  close: () => void;
  reset: () => void;
}

// eslint-disable-next-line
export const useSidebarStore = create<SidebarState>((set) => ({
  isOpen: false,
  hamburgerButtonRef: null,
  setHanburgerButtonRef: (target: React.RefObject<HTMLButtonElement>) => {
    set({ hamburgerButtonRef: target });
  },
  toggle: () =>
    set((state: { isOpen: boolean }) => ({ isOpen: !state.isOpen })),
  close: () => set({ isOpen: false }),
  reset: () => set({ isOpen: false }),
}));
