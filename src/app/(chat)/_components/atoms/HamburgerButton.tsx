import HamburgerIcon from '@/assets/icons/HamburgerIcon';
import { useSidebarStore } from '@/store/sidebar';
import React from 'react';
import { useShallow } from 'zustand/react/shallow';

type Props = {
  refetchUserList: () => void;
};

export default function HamburgerButton({ refetchUserList }: Props) {
  const { toggle, isOpen } = useSidebarStore(
    useShallow((state) => ({ toggle: state.toggle, isOpen: state.isOpen })),
  );
  const handleClick = () => {
    toggle();
    refetchUserList();
  };

  return (
    <button
      className="pl-5"
      aria-label="메뉴 열기"
      aria-haspopup
      aria-expanded={isOpen}
      aria-controls="agora-side-bar"
      onClick={handleClick}
      type="button"
    >
      <HamburgerIcon className="w-20 lg:w-22 cursor-pointer" />
    </button>
  );
}
