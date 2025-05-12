import HamburgerIcon from '@/assets/icons/HamburgerIcon';
import { useSidebarStore } from '@/store/sidebar';
import React, { useEffect, useRef } from 'react';
import { useShallow } from 'zustand/react/shallow';

type Props = {
  refetchUserList: () => void;
};

export default function HamburgerButton({ refetchUserList }: Props) {
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const { toggle, isOpen, setHamburgerButtonRef } = useSidebarStore(
    useShallow((state) => ({
      toggle: state.toggle,
      isOpen: state.isOpen,
      setHamburgerButtonRef: state.setHanburgerButtonRef,
      hamburgerButtonRef: state.hamburgerButtonRef,
    })),
  );
  const handleClick = () => {
    toggle();
    refetchUserList();
  };

  useEffect(() => {
    if (hamburgerRef.current) {
      setHamburgerButtonRef(hamburgerRef);
    }
  }, [hamburgerRef, setHamburgerButtonRef]);

  return (
    <button
      id="sidebar-hamburger"
      className="pl-5"
      aria-label="사이드바 열기"
      aria-haspopup="dialog"
      aria-expanded={isOpen}
      aria-controls="agora-side-bar"
      onClick={handleClick}
      ref={hamburgerRef}
      type="button"
    >
      <HamburgerIcon className="w-20 lg:w-22 cursor-pointer" />
    </button>
  );
}
