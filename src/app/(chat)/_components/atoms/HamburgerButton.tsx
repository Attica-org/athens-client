import HamburgerIcon from '@/assets/icons/HamburgerIcon';
import React from 'react';

type Props = {
  toggleMenu: () => void;
  refetchUserList: () => void;
};

export default function HamburgerButton({
  toggleMenu,
  refetchUserList,
}: Props) {
  const handleClick = () => {
    toggleMenu();
    refetchUserList();
  };

  return (
    <button
      className="pl-5"
      aria-label="메뉴 열기"
      onClick={handleClick}
      type="button"
    >
      <HamburgerIcon className="w-20 lg:w-22 cursor-pointer" />
    </button>
  );
}
