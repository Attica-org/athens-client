import React from 'react';

type Props = {
  className: string;
};

export default function SendIcon({ className }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 -960 960 960"
      className={className}
      aria-hidden
    >
      <path
        fill="var(--icon-color-send)"
        d="M120-160v-240l320-80-320-80v-240l760 320-760 320Z"
      />
    </svg>
  );
}
