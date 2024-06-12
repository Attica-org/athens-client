import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface ThemeState {
  darkMode: boolean;
  toggleTheme: () => void;
  reset: () => void;
}

const StorageKey = 'theme';

// eslint-disable-next-line import/prefer-default-export
export const useDarkMode = create(
  persist<ThemeState>(
    (set, get) => ({
      darkMode: false,
      toggleTheme() {
        const newDarkMode = !get().darkMode;
        if (newDarkMode) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        set({ darkMode: newDarkMode });
      },
      reset() {
        set({ darkMode: !get().darkMode });
        if (!get().darkMode) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      },
    }),
    {
      name: StorageKey,
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          if (state.darkMode) {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        }
      },
    },
  ),
);
