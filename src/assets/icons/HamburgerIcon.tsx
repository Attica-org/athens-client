'use client';

import { useDarkMode } from '@/store/darkMode';
import React from 'react';

type Props = {
  className: string;
};

export default function HamburgerIcon({ className }: Props) {
  const { darkMode } = useDarkMode();

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 -960 960 960"
      className={className}
      fill="currentColor"
      aria-hidden
    >
      <path
        fill={darkMode ? '#fff' : '#000'}
        d="M120-240v-60h720v60H120Zm0-210v-60h720v60H120Zm0-210v-60h720v60H120Z"
      />
    </svg>
  );
}
