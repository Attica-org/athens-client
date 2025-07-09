import { useCallback, useLayoutEffect } from 'react';
import showToast from '@/utils/showToast';
import { signInWithCredentials } from '@/serverActions/auth';
import { signIn } from 'next-auth/react';
import isNull from '@/utils/validation/validateIsNull';

type GetAccessTokenActionArg = {
  routeAgoraPage: (path: string) => void;
  user: string;
};

export const useGetAccessTokenAction = ({
  routeAgoraPage,
  user,
}: GetAccessTokenActionArg) => {
  const getUserAccessToken = useCallback(
    async (authuser: string) => {
      const tempToken = await signInWithCredentials(authuser);

      if (tempToken.success) {
        try {
          await signIn('credentials', {
            accessToken: tempToken.accessToken,
          });
        } catch (error) {
          showToast('로그인에 실패했습니다. 다시 시도해주세요.', 'error');
          routeAgoraPage('/');
        }
      } else if (!tempToken.success) {
        showToast('로그인에 실패했습니다. 다시 시도해주세요.', 'error');
        routeAgoraPage('/');
      }
    },
    [routeAgoraPage],
  );

  useLayoutEffect(() => {
    if (isNull(user)) {
      return;
    }

    getUserAccessToken(user);
  }, [getUserAccessToken, user]);
};
