'use client';

import React from 'react';
import BackButton from '@/app/_components/atoms/BackButton';

export default function Header() {
  return (
    <header className="flex flex-row py-12 px-4 ">
      <BackButton goHome />
      <div className="ml-4">
        <span className="font-bold text-lg dark:text-white">내 정보 관리</span>
      </div>
    </header>
  );
}
