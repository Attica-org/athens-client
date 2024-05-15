'use client';

import React, {
  KeyboardEventHandler,
  MouseEventHandler, useEffect, useRef, useState,
} from 'react';
import { useRouter } from 'next/navigation';
import RemoveButton from '../atoms/RemoveButton';

type Props = {
  children: React.ReactNode;
  title: string;
  removeIcon: boolean;
  animation: boolean;
};

export default function ModalBase({
  children,
  title,
  removeIcon,
  animation,
}: Props) {
  const router = useRouter();
  const [opacity, setOpacity] = useState('opacity-0');
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    setOpacity('opacity-100');

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [animation]);

  useEffect(() => {
    // 모달창이 열릴 때 첫 번째 포커스 가능한 요소에 초점 설정
    const focusableElements = modalRef.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );

    if (focusableElements) {
      const firstFocusableElement = focusableElements[0] as HTMLElement;
      firstFocusableElement?.focus();
    }
  }, [modalRef]);

  const clickOutSideModal: MouseEventHandler<HTMLDivElement> = (e) => {
    if (e.target === e.currentTarget && removeIcon) router.back();
  };

  const keyDownOutSideModal:KeyboardEventHandler<HTMLElement> = (e) => {
    if (e.key === 'Enter' && e.target === e.currentTarget && removeIcon) router.back();
  };

  return (
    <div
      role="button"
      tabIndex={0}
      ref={modalRef}
      onClick={clickOutSideModal}
      onKeyDown={keyDownOutSideModal}
      className="w-full h-full flex absolute justify-center items-center z-20 top-0 right-0 left-0 bottom-0 bg-opacity-50 bg-dark-bg-dark"
    >
      <div
        role="dialog"
        aria-modal="true"
        className={`${
          animation && 'transition duration-500 transform scale-100 '
        } ${opacity} under-mobile:mt-13rem bg-white dark:bg-dark-light-300 dark:text-dark-line-light bottom-7rem mobile:w-[70vw] pb-0.5rem under-mobile:pb-1rem under-mobile:w-[80vw] w-[50vw] lg:w-40rem relative rounded-2xl min-w-220`}
      >
        <h1 className="font-semibold flex justify-center items-center mt-2rem text-md">
          {title}
        </h1>
        {removeIcon && <RemoveButton className="absolute right-20 top-20" />}
        <div className="p-14">{children}</div>
      </div>
    </div>
  );
}
