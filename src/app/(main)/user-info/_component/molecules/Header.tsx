'use client';

import React from 'react';
import BackButton from '@/app/_components/atoms/BackButton';
import { useRouter } from 'next/navigation';

export default function Header() {
  const router = useRouter();
  const handleBack = () => {
    router.push('/home');
  };
  return (
    <header className="flex flex-row py-12 px-4 ">
      <BackButton onClick={handleBack} />
      <div className="ml-4">
        <span className="font-bold text-lg dark:text-white">내 정보 관리</span>
      </div>
    </header>
  );
}
