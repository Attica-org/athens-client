'use client';

import React from 'react';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { homeSegmentKey } from '@/constants/segmentKey';
import ActionButton from '../atoms/ActionButton';

type Props = {
  className?: string;
};

export function ActionButtons({ className }: Props) {
  const session = useSession();
  const router = useRouter();

  const handleSignOut = () => {
    if (session?.status === 'authenticated') {
      signOut();
      router.push(homeSegmentKey);
    }
  };

  return (
    <section className={className}>
      <ActionButton
        label="로그아웃"
        className="text-sm mb-14 text-gray-500 dark:text-gray-300"
        onClick={handleSignOut}
      />
      <ActionButton
        label="Athens 탈퇴"
        className="text-sm text-gray-500 dark:text-gray-300"
      />
    </section>
  );
}
