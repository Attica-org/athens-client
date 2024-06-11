import { create } from 'zustand';

interface ThemeState {
  darkMode: boolean;
  toggleTheme: () => void;
  reset: () => void;
}

// eslint-disable-next-line import/prefer-default-export
export const useDarkMode = create<ThemeState>((set, get) => ({
  darkMode: localStorage.getItem('theme') === 'dark',
  toggleTheme() {
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', get().darkMode ? 'light' : 'dark');
    set({ darkMode: !get().darkMode });
  },
  reset() {
    set({ darkMode: localStorage.getItem('theme') !== 'dark' });
  },
}));
