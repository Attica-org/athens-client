import { create } from 'zustand';

interface SidebarState {
  isOpen: boolean;
  toggle: () => void;
  close: () => void;
  reset: () => void;
}

// eslint-disable-next-line
export const useSidebarStore = create<SidebarState>((set) => ({
  isOpen: false,
  toggle: () => set((state: { isOpen: boolean }) => ({ isOpen: !state.isOpen })),
  close: () => set({ isOpen: false }),
  reset: () => set({ isOpen: false }),
}));
