'use client';

import BackIcon from '@/assets/icons/BackIcon';
import { homeSegmentKey } from '@/constants/segmentKey';
import { useRouter } from 'next/navigation';
import React from 'react';

type Props = {
  goHome?: boolean;
};

export default function BackButton({ goHome }: Props) {
  const router = useRouter();

  const handleBack = () => {
    if (goHome) {
      router.replace(homeSegmentKey);
    } else {
      router.back();
    }
  };

  return (
    <button aria-label="뒤로가기" type="button" onClick={handleBack}>
      <BackIcon className="w-22 ml-1rem cursor-pointer" />
    </button>
  );
}
