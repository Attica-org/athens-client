'use client';

import DarkIcon from '@/assets/icons/DarkIcon';
import LightIcon from '@/assets/icons/LightIcon';
import { THEME } from '@/constants/theme';
import { toggleThemeValue } from '@/serverActions/theme';
import React, { useState } from 'react';

type Props = {
  theme: string;
};

export default function ThemeSwitcher({ theme }: Props) {
  const [isDarkMode, setIsDarkMode] = useState(theme === THEME.DARK);

  const handleToggleTheme = async () => {
    const currentTheme = await toggleThemeValue();
    let metaThemeColor = document.querySelector('meta[name="theme-color"]');

    if (!metaThemeColor) {
      metaThemeColor = document.createElement('meta');
      metaThemeColor.setAttribute('name', 'theme-color');
      document.head.appendChild(metaThemeColor);
    }

    if (currentTheme === THEME.LIGHT) {
      document.documentElement.classList.remove(THEME.DARK);
      document.documentElement.setAttribute('data-theme', THEME.LIGHT);
      metaThemeColor.setAttribute('content', THEME.LIGHT);

      setIsDarkMode(false);
    } else if (currentTheme === THEME.DARK) {
      document.documentElement.classList.add(THEME.DARK);
      document.documentElement.setAttribute('data-theme', THEME.DARK);
      metaThemeColor.setAttribute('content', THEME.DARK);

      setIsDarkMode(true);
    }
  };

  return (
    <div>
      {!isDarkMode ? (
        <button
          aria-label="다크모드로 바꾸기"
          type="button"
          onClick={handleToggleTheme}
        >
          <DarkIcon fill="#636366" className="w-24 h-24 mr-5" />
        </button>
      ) : (
        <button
          aria-label="라이트모드로 바꾸기"
          type="button"
          onClick={handleToggleTheme}
        >
          <LightIcon fill="#d0d0d0" className="w-24 h-24 mr-5" />
        </button>
      )}
    </div>
  );
}
