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
import { useAgora } from '@/store/agora';
import { useShallow } from 'zustand/react/shallow';
import showToast from '@/utils/showToast';
import Swal from 'sweetalert2';
import ActionButton from '../atoms/ActionButton';
import postLogout from '../../_lib/postLogout';
import deleteUserAccount from '../../_lib/deleteUserAccount';

type Props = {
  className?: string;
};

type DeleteAccountMutationProps = {
  memberId: number;
};

export function ActionButtons({ className }: Props) {
  const { data: session, status } = useSession();
  const { userId } = useAgora(
    useShallow((state) => ({
      userId: state.enterAgora.userId,
    })),
  );

  const handleSignOut = async () => {
    if (!isNull(session) && status === AUTHENTICATED) {
      await postLogout();
      await signOut({ redirect: true });
    }
  };

  const deleteAccountMutation = useMutation({
    mutationFn: async ({ memberId }: DeleteAccountMutationProps) =>
      deleteUserAccount(memberId),
    onSuccess: async () => {
      await swalDeleteAccountSuccessAlert().then((result) => {
        if (result.dismiss === Swal.DismissReason.timer) {
          signOut({ redirect: true });
        }
      });
    },
    onError: () => {
      showToast('계정 삭제에 실패했습니다.', 'error');
    },
  });

  const handleDeleteAccount = async () => {
    const result = await swalDeleteAccountConfirm();

    if (result.isConfirmed) {
      deleteAccountMutation.mutate({ memberId: userId });
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
