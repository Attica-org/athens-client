'use client';

import RemoveIcon from '@/assets/icons/RemoveIcon';
import { useRouter } from 'next/navigation';
import React from 'react';

type Props = {
  className?: string;
};

export default function CloseButton({ className = '' }: Props) {
  const router = useRouter();

  const onClickClose = () => {
    router.back();
  };

  return (
    <button
      type="button"
      aria-label="모달창 닫기"
      onClick={onClickClose}
      className={className}
    >
      <div aria-hidden>
        <RemoveIcon className="w-22 cursor-pointer" />
      </div>
    </button>
  );
}
