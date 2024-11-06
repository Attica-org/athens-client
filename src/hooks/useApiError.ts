import {
  AUTHORIZATION_FAIL,
  AUTH_MESSAGE,
  SIGNIN_REQUIRED,
} from '@/constants/authErrorMessage';
import { getReissuanceToken } from '@/lib/getReissuanceToken';
import showToast from '@/utils/showToast';
import { signOut } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { useCallback } from 'react';

const useApiError = () => {
  const signOutUser = useCallback(async () => {
    await signOut();
    redirect('/');
  }, []);

  const authErrorHandlers = useCallback(async () => {
    const reissueResponse = await getReissuanceToken();

    if (reissueResponse === AUTHORIZATION_FAIL) {
      console.log('useApiError에서의 세션 만료 메시지', reissueResponse);
      showToast('로그인 세션이 만료되었습니다. 다시 로그인 해주세요.', 'error');
      await signOutUser();
    }
    // } else if (reissueResponse === AUTHORIZATION_SUCCESS) {
    //   // 기존 요청 재시도

    // }
  }, [signOutUser]);

  const handleError = useCallback(
    async (error: Error) => {
      const response = error as any;
      if (error instanceof Error) {
        if (AUTH_MESSAGE.includes(error.message)) {
          await authErrorHandlers();
        } else if (error.message === SIGNIN_REQUIRED) {
          showToast('로그인이 필요합니다.', 'error');
          await signOutUser();
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
