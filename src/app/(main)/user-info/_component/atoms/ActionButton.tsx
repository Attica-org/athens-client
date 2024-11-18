import React from 'react';

type Props = {
  label: string;
  onClick?: () => void;
  className?: string;
};
export default function ActionButton({ label, onClick, className }: Props) {
  return (
    <button
      type="button"
      className={className}
      onClick={onClick}
      onKeyDown={onClick}
      aria-label={`${label} 버튼`}
    >
      {label}
    </button>
  );
}
