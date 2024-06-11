'use client';

import { useDarkMode } from '@/store/darkMode';
import { useEffect } from 'react';

export default function SetTheme() {
  const { darkMode } = useDarkMode();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return null;
}
