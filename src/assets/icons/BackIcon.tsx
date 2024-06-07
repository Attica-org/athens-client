'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useDarkMode } from '@/store/darkMode';

type Props = {
  className: string;
};

export default function BackIcon({ className }: Props) {
  const { darkMode } = useDarkMode();
  const router = useRouter();

  const handleBack = () => {
    router.replace('/home');
  };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 -960 960 960"
      className={className}
      onClick={handleBack}
      aria-hidden
    >
      <path
        fill={darkMode ? '#fff' : '#000'}
        d="M400-80 0-480l400-400 56 57-343 343 343 343-56 57Z"
      />
    </svg>
  );
}
