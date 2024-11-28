'use client';

import Loading from '@/app/_components/atoms/loading';
import showToast from '@/utils/showToast';
import { signInWithCredentials } from '@/serverActions/auth';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import isNull from '@/utils/isNull';

type Props = {
  user: string;
};

export default function AuthLogin({ user }: Props) {
  const router = useRouter();
  const { data: session } = useSession();

  const getUserAccessToken = async (authuser: string) => {
    const tempToken = await signInWithCredentials(authuser);

    if (tempToken.success) {
      try {
        await signIn('credentials', {
          accessToken: tempToken.accessToken,
        });
      } catch (error) {
        showToast('로그인에 실패했습니다. 다시 시도해주세요.', 'error');
        router.replace('/');
      }
    } else if (!tempToken.success) {
      showToast('로그인에 실패했습니다. 다시 시도해주세요.', 'error');
      router.replace('/');
    }
  };

  useEffect(() => {
    if (isNull(session)) {
      router.replace('/home');
    }
  }, [session]);

  useEffect(() => {
    getUserAccessToken(user);
  }, []);

  return (
    <div className="min-w-300 w-full h-full flex absolute justify-center items-center z-20 top-0 right-0 left-0 bottom-0 bg-opacity-50 bg-dark-bg-dark">
      <Loading className="absolute z-100" w="32" h="32" />
    </div>
  );
}
