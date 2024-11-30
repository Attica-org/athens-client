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
        const themeColor = newDarkMode ? '#3f3f3f' : '#000000';
        let metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (newDarkMode) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        if (!metaThemeColor) {
          metaThemeColor = document.createElement('meta');
          metaThemeColor.setAttribute('name', 'theme-color');
          document.head.appendChild(metaThemeColor);
        }
        metaThemeColor.setAttribute('content', themeColor);
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
