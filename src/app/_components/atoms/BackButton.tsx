import BackIcon from '@/assets/icons/BackIcon';
import React from 'react';

type Props = {
  onClick: () => void;
};

export default function BackButton({ onClick }: Props) {
  return (
    <button aria-label="뒤로가기" type="button" onClick={onClick}>
      <BackIcon className="w-22 ml-1rem cursor-pointer" />
    </button>
  );
}
