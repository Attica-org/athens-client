'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import isNull from '@/utils/validation/validateIsNull';
import { AUTHENTICATED } from '@/constants/auth';
import { swalDeleteAccountConfirm } from '@/utils/swalAlert';
import { useLogoutMutation } from '@/hooks/query/useLogoutMutation';
import { useDeleteAccountMutation } from '@/hooks/query/useDeleteAccountMutation';
import ActionButton from '../atoms/ActionButton';

type Props = {
  className?: string;
};

export function ActionButtons({ className }: Props) {
  const { data: session, status } = useSession();

  const logoutMutation = useLogoutMutation();
  const deleteAccountMutation = useDeleteAccountMutation();

  const handleSignOut = async () => {
    if (!isNull(session) && status === AUTHENTICATED) {
      logoutMutation.mutate();
    }
  };

  const handleDeleteAccount = async () => {
    const result = await swalDeleteAccountConfirm();

    if (result.isConfirmed) {
      deleteAccountMutation.mutate();
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
        onClick={handleDeleteAccount}
      />
    </section>
  );
}
