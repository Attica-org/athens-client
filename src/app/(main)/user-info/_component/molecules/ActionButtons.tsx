'use client';

import React from 'react';
import { signOut, useSession } from 'next-auth/react';
import isNull from '@/utils/validation/validateIsNull';
import { AUTHENTICATED } from '@/constants/auth';
import ActionButton from '../atoms/ActionButton';
import postLogout from '../../_lib/postLogout';

type Props = {
  className?: string;
};

export function ActionButtons({ className }: Props) {
  const { data: session, status } = useSession();

  const handleSignOut = async () => {
    if (!isNull(session) && status === AUTHENTICATED) {
      await postLogout();
      await signOut({ redirect: true });
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
