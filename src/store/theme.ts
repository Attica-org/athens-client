import { THEME } from '@/constants/theme';
import { create } from 'zustand';

interface State {
  isDarkMode: boolean;
}

interface Action {
  toggleTheme(theme: THEME): void;
}
export const useThemeStore = create<State & Action>((set) => ({
  isDarkMode: false,
  toggleTheme(theme) {
    const newDarkMode = theme === THEME.DARK;
    const themeColor = newDarkMode ? '#3f3f3f' : '#000000';
    let metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (!metaThemeColor) {
      metaThemeColor = document.createElement('meta');
      metaThemeColor.setAttribute('name', 'theme-color');
      document.head.appendChild(metaThemeColor);
    }
    metaThemeColor.setAttribute('content', themeColor);
    set({ isDarkMode: newDarkMode });
  },
}));
