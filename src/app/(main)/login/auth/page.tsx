'use client';

import { signIn, useSession } from 'next-auth/react';
import { signInWithCredentials } from '@/serverActions/auth';
import React, { useEffect } from 'react';
import showToast from '@/utils/showToast';
import { useRouter } from 'next/navigation';
import Loading from '@/app/_components/atoms/loading';
import SignIn from '../../_components/templates/SignIn';

type Props = {
  searchParams: {
    user: string;
  };
};

export default function LoginConfirm({ searchParams }: Props) {
  const session = useSession();
  const { user } = searchParams;
  const router = useRouter();

  const getUserAccessToken = async (authuser: string) => {
    const tempToken = await signInWithCredentials(authuser);

    if (tempToken.success) {
      try {
        await signIn('credentials', {
          accessToken: tempToken,
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
    if (session.data) {
      router.replace('/home');
    }
  }, [session]);

  useEffect(() => {
    getUserAccessToken(user);
  }, []);

  return (
    <div>
      <SignIn />
      <div className="min-w-300 w-full h-full flex absolute justify-center items-center z-20 top-0 right-0 left-0 bottom-0 bg-opacity-50 bg-dark-bg-dark">
        <Loading className="absolute z-100" w="32" h="32" />
      </div>
    </div>
  );
}
