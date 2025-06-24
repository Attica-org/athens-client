import { THEME, THEME_CONTENT } from '@/constants/theme';
import { toggleThemeValue } from '@/serverActions/theme';
import isNull from '@/utils/validation/validateIsNull';
import { useState } from 'react';

type ThemeSwitchArg = {
  theme: THEME;
};

export const useThemeSwitch = ({ theme }: ThemeSwitchArg) => {
  const [isDarkMode, setIsDarkMode] = useState(theme === THEME.DARK);
  const [srStatusMessage, setSrStatusMessage] = useState('');
  let metaThemeColor = document.querySelector('meta[name="theme-color"]');

  const handleToggleTheme = async () => {
    const currentTheme = await toggleThemeValue();

    if (isNull(metaThemeColor)) {
      metaThemeColor = document.createElement('meta');
      metaThemeColor.setAttribute('name', 'theme-color');
      document.head.appendChild(metaThemeColor);
    }

    if (currentTheme === THEME.LIGHT) {
      document.documentElement.classList.remove(THEME.DARK);
      document.documentElement.setAttribute('data-theme', THEME.LIGHT);
      metaThemeColor.setAttribute('content', THEME_CONTENT.LIGHT);

      setIsDarkMode(false);
      setSrStatusMessage('라이트 모드로 바뀌었습니다.');
    } else if (currentTheme === THEME.DARK) {
      document.documentElement.classList.add(THEME.DARK);
      document.documentElement.setAttribute('data-theme', THEME.DARK);
      metaThemeColor.setAttribute('content', THEME_CONTENT.DARK);

      setIsDarkMode(true);
      setSrStatusMessage('다크 모드로 바뀌었습니다.');
    }
  };

  return {
    handleToggleTheme,
    isDarkMode,
    srStatusMessage,
  };
};
