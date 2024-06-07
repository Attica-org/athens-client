import { useDarkMode } from '@/store/darkMode';
import React from 'react';

type Props = {
  className: string;
  fill: string;
};

export default function SendIcon({ className, fill }: Props) {
  const { darkMode } = useDarkMode();

  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" className={className} aria-hidden>
      <path fill={darkMode ? '#000' : fill} d="M120-160v-240l320-80-320-80v-240l760 320-760 320Z" />
    </svg>

  );
}
