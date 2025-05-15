'use client';

import React, { MouseEventHandler, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import CloseButton from '../atoms/CloseButton';

type Props = {
  children: React.ReactNode;
  title: string;
  closeIcon: boolean;
  animation: boolean;
};

export default function ModalBase({
  children,
  title,
  closeIcon,
  animation,
}: Props) {
  const router = useRouter();
  const [opacity, setOpacity] = useState('opacity-0');
  const modalRef = useRef<HTMLDivElement>(null);
  useFocusTrap(modalRef, closeIcon);
  // useEscapeClose(modalRef, closeIcon);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    setOpacity('opacity-100');

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [animation]);

  const onClickOutSide: MouseEventHandler<HTMLElement> = (e) => {
    if (closeIcon && !modalRef.current?.contains(e.target as Node)) {
      e.preventDefault();
      router.back();
    }
  };

  useEffect(() => {
    modalRef.current?.focus();
  }, []);

  return (
    <section
      role="dialog"
      aria-modal="true"
      tabIndex={-1}
      aria-labelledby="title"
      className="min-w-300 w-full h-full flex absolute justify-center items-center z-20 top-0 right-0 left-0 bottom-0"
    >
      <div
        role="presentation"
        onClick={onClickOutSide}
        className="w-full h-full flex absolute justify-center items-center bg-opacity-50 bg-dark-bg-dark"
      >
        <div
          ref={modalRef}
          role="region"
          className={`${
            animation && 'transition duration-500 transform scale-100 '
          } ${opacity} top-60 mx-auto bg-white dark:bg-dark-light-300 dark:text-dark-line-light mobile:w-[80vw] pb-0.5rem under-mobile:pb-1rem min-w-270 lg:w-40rem fixed rounded-2xl h-fit`}
        >
          <h1
            id="title"
            aria-describedby="description"
            className="font-semibold flex justify-center items-center mt-2rem text-sm lg:text-md"
          >
            {title}
          </h1>
          {closeIcon && <CloseButton className="absolute right-20 top-20" />}
          <main className="p-14">{children}</main>
        </div>
      </div>
    </section>
  );
}
