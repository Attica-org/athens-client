'use client';

import showToast from '@/utils/showToast';
import { signOut } from 'next-auth/react';
import { useCallback } from 'react';
import {
  AUTHORIZATION_FAIL,
  AUTH_MESSAGE,
  SIGNIN_REQUIRED,
} from '@/constants/authErrorMessage';
import {
  QueryClient,
  QueryKey,
  UseMutateFunction,
} from '@tanstack/react-query';
import isNull from '@/utils/isNull';
import retryConfig from '@/lib/retryConfig';
import useUpdateSession from './useUpdateSession';

const queryClient = new QueryClient();

const useApiError = () => {
  const { callReissueFn } = useUpdateSession();

  const authErrorHandlers = useCallback(
    async (
      retryMutation?: UseMutateFunction<any, Error, void, unknown>,
      queryKey?: QueryKey,
    ) => {
      const reissueResponse = await callReissueFn();

      if (reissueResponse === AUTHORIZATION_FAIL) {
        showToast(
          '로그인 세션이 만료되었습니다. 다시 로그인 해주세요.',
          'error',
        );
        retryConfig.tokenReissuance = 3;
        // if (isNull(window)) {
        //   import('@/serverActions/auth').then((module) => {
        //     module.signOutWithCredentials();
        //   });
        // }
        signOut();
      }

      if (!isNull(retryMutation) && retryConfig.tokenReissuance > 0) {
        retryConfig.tokenReissuance -= 1;
        retryMutation();
        return;
      }

      if (!isNull(queryKey) && retryConfig.tokenReissuance > 0) {
        retryConfig.tokenReissuance -= 1;
        await queryClient.refetchQueries({ queryKey, exact: true });
        return;
      }

      retryConfig.tokenReissuance = 3;
    },
    [callReissueFn],
  );

  const handleError = useCallback(
    async (
      error: Error,
      retryMutation?: UseMutateFunction<any, Error, void, unknown>,
      queryKey?: QueryKey,
    ) => {
      const response = error as any;
      if (error instanceof Error) {
        if (AUTH_MESSAGE.includes(error.message)) {
          await authErrorHandlers(retryMutation, queryKey);
        } else if (error.message === SIGNIN_REQUIRED) {
          showToast('로그인이 필요합니다.', 'error');
          signOut();
        } else if (response.status === 500) {
          showToast(
            '서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.',
            'error',
          );
        } else if (error.message.length > 0) {
          showToast(error.message, 'error');
        }
      }
    },
    [authErrorHandlers],
  );

  return { handleError };
};
export default useApiError;
