import React from 'react';
import DARKMODE from '@/constants/darkMode';

type Props = {
  className: string;
  fill: string;
};

export default function SendIcon({ className, fill }: Props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" className={className} aria-hidden>
      <path fill={DARKMODE ? '#000' : fill} d="M120-160v-240l320-80-320-80v-240l760 320-760 320Z" />
    </svg>

  );
}
