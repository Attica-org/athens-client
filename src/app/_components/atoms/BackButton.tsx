'use client';

import BackIcon from '@/assets/icons/BackIcon';
import { useRouter } from 'next/navigation';
import React from 'react';

export default function BackButton() {
  const router = useRouter();

  const handleBack = () => {
    router.replace('/home');
  };

  return (
    <button aria-label="뒤로가기" type="button">
      <BackIcon onClick={handleBack} className="w-22 ml-1rem cursor-pointer" />
    </button>
  );
}
