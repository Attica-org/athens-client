'use client';

import { useDarkMode } from '@/store/darkMode';
import React from 'react';

type Props = {
  className?: string;
};

export default function ArrowDownIcon({ className }: Props) {
  const { darkMode } = useDarkMode();

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      viewBox="0 -960 960 960"
      fill={darkMode ? '#e8eaed' : '#000'}
    >
      <path d="M480-371.69 267.69-584 296-612.31l184 184 184-184L692.31-584 480-371.69Z" />
    </svg>
  );
}
