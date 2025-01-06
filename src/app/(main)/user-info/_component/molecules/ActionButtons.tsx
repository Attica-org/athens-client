'use client';

import React from 'react';
import { signOut, useSession } from 'next-auth/react';
import isNull from '@/utils/validation/validateIsNull';
import { AUTHENTICATED } from '@/constants/auth';
import {
  swalDeleteAccountConfirm,
  swalDeleteAccountSuccessAlert,
} from '@/utils/swalAlert';
import { useMutation } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import useApiError from '@/hooks/useApiError';
import ActionButton from '../atoms/ActionButton';
import postLogout from '../../_lib/postLogout';
import deleteUserAccount from '../../_lib/deleteUserAccount';

type Props = {
  className?: string;
};

export function ActionButtons({ className }: Props) {
  const { data: session, status } = useSession();
  const { handleError } = useApiError();

  const logoutMutation = useMutation({
    mutationFn: async () => postLogout(),
    onSuccess: async () => {
      await signOut({ redirect: true });
    },
    onError: async (error) => {
      await handleError(error, logoutMutation.mutate);
    },
  });

  const handleSignOut = async () => {
    if (!isNull(session) && status === AUTHENTICATED) {
      logoutMutation.mutate();
    }
  };

  const deleteAccountMutation = useMutation({
    mutationFn: async () => deleteUserAccount(),
    onSuccess: async () => {
      await swalDeleteAccountSuccessAlert().then((result) => {
        if (result.dismiss === Swal.DismissReason.timer) {
          signOut({ redirect: true });
        }
      });
    },
    onError: async (error) => {
      await handleError(error, () => deleteAccountMutation.mutate());
    },
  });

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
