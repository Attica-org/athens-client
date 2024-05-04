import React from 'react';
import DARKMODE from '@/constants/darkMode';

type Props = {
  className: string;
  onClick: () => void;
};

export default function BackIcon({ className, onClick }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 -960 960 960"
      className={className}
      onClick={onClick}
      aria-hidden
    >
      <path
        fill={DARKMODE ? '#fff' : '#000'}
        d="M400-80 0-480l400-400 56 57-343 343 343 343-56 57Z"
      />
    </svg>
  );
}
