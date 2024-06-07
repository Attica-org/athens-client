'use client';

import DarkIcon from '@/assets/icons/DarkIcon';
import LightIcon from '@/assets/icons/LightIcon';
import { useDarkMode } from '@/store/darkMode';
import React from 'react';

export default function ThemeSwitcher() {
  const { darkMode, toggleTheme } = useDarkMode();

  return (
    <div>
      {!darkMode ? (
        <button aria-label="다크모드" type="button" onClick={toggleTheme}>
          <DarkIcon fill="#636366" className="w-24 h-24 mr-5" />
        </button>
      ) : (
        <button aria-label="라이트모드" type="button" onClick={toggleTheme}>
          <LightIcon fill="#d0d0d0" className="w-24 h-24 mr-5" />
        </button>
      )}
    </div>
  );
}
