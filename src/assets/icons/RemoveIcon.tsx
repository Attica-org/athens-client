import React from 'react';

type Props = {
  className?: string;
  onClick?: () => void;
};

function RemoveIcon({ className = '', onClick = () => {} }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 -960 960 960"
      fill="var(--icon-color-remove)"
      className={className}
      onClick={onClick}
    >
      <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
    </svg>
  );
}

export default RemoveIcon;
