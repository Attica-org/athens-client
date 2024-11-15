'use client';

import showToast from '@/utils/showToast';
import { signOut } from 'next-auth/react';
import { useCallback } from 'react';
import {
  AUTHORIZATION_FAIL,
  AUTH_MESSAGE,
  SIGNIN_REQUIRED,
} from '@/constants/authErrorMessage';
import { UseMutateFunction } from '@tanstack/react-query';
import isNull from '@/utils/isNull';
import useUpdateSession from './useUpdateSession';

const useApiError = () => {
  const { callReissueFn } = useUpdateSession();

  const authErrorHandlers = useCallback(
    async (callback?: UseMutateFunction<any, Error, void, unknown>) => {
      const reissueResponse = await callReissueFn();

      if (reissueResponse === AUTHORIZATION_FAIL) {
        showToast(
          '로그인 세션이 만료되었습니다. 다시 로그인 해주세요.',
          'error',
        );
        signOut();
      }

      if (!isNull(callback)) {
        callback();
      }
    },
    [callReissueFn],
  );

  const handleError = useCallback(
    async (
      error: Error,
      callback?: UseMutateFunction<any, Error, void, unknown>,
    ) => {
      const response = error as any;
      if (error instanceof Error) {
        if (AUTH_MESSAGE.includes(error.message)) {
          await authErrorHandlers(callback);
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
