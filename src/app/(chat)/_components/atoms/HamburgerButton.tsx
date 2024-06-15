import HamburgerIcon from '@/assets/icons/HamburgerIcon';
import React from 'react';

type Props = {
  toggleMenu: () => void;
};

export default function HamburgerButton({ toggleMenu }: Props) {
  return (
    <button aria-label="메뉴 열기" onClick={toggleMenu} type="button">
      <HamburgerIcon className="w-19 cursor-pointer" />
    </button>
  );
}
