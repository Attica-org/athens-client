'use client';

import React from 'react';

type Props = {
  className: string;
};

export default function BackIcon({ className }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 -960 960 960"
      className={className}
      aria-hidden
    >
      <path
        fill="var(--icon-color-back)"
        d="M400-80 0-480l400-400 56 57-343 343 343 343-56 57Z"
      />
    </svg>
  );
}
