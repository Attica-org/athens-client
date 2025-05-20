import React from 'react';

type Props = {
  label: string;
  onClick?: () => void;
  className?: string;
};
export default function ActionButton({ label, onClick, className }: Props) {
  function handleOnKeyDown(e: React.KeyboardEvent<HTMLButtonElement>) {
    if (e.key === 'Enter') {
      onClick?.();
    }
  }

  return (
    <button
      type="button"
      className={className}
      onClick={onClick}
      onKeyDown={handleOnKeyDown}
      aria-label={`${label}`}
    >
      {label}
    </button>
  );
}
