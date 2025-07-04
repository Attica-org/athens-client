'use client';

import DarkIcon from '@/assets/icons/DarkIcon';
import LightIcon from '@/assets/icons/LightIcon';
import { THEME } from '@/constants/theme';
import { useThemeSwitch } from '@/hooks/useThemeSwitch';
import React from 'react';

type Props = {
  theme: THEME;
};

export default function ThemeSwitcher({ theme }: Props) {
  const { handleToggleTheme, isDarkMode, srStatusMessage } = useThemeSwitch({
    theme,
  });

  return (
    <div>
      <div aria-live="polite" className="sr-only">
        {srStatusMessage}
      </div>
      {!isDarkMode ? (
        <button
          aria-label="다크모드로 전환"
          type="button"
          onClick={handleToggleTheme}
        >
          <DarkIcon fill="#636366" className="w-24 h-24 mr-5" />
        </button>
      ) : (
        <button
          aria-label="라이트모드로 전환"
          type="button"
          onClick={handleToggleTheme}
        >
          <LightIcon fill="#d0d0d0" className="w-24 h-24 mr-5" />
        </button>
      )}
    </div>
  );
}
