import { AUTH_MESSAGE, SIGNIN_REQUIRED } from '@/constants/authErrorMessage';
import { LOGOUT_ERROR_MESSAGE } from '@/constants/responseErrorMessage';
import { callFetchWrapper } from '@/lib/fetchWrapper';
import { getSession } from '@/serverActions/auth';
import isNull from '@/utils/validation/validateIsNull';

const postLogout = async () => {
  const session = await getSession();
  if (isNull(session)) {
    throw new Error(SIGNIN_REQUIRED);
  }

  const res = await callFetchWrapper<any>('/api/v1/auth/member/logout', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.user?.accessToken}`,
    },
    credentials: 'include',
  });

  if (!res.ok && !res.success) {
    if (!res.error) {
      throw new Error(LOGOUT_ERROR_MESSAGE.UNKNOWN_ERROR);
    }
    const errorMessage =
      typeof res.error.message === 'string' ? res.error.message : 'ERROR';

    if (res.error.code === 1201) {
      throw new Error(LOGOUT_ERROR_MESSAGE.EXPIRED_TOKEN);
    } else if (AUTH_MESSAGE.includes(errorMessage)) {
      throw new Error(errorMessage);
    }

    throw new Error(LOGOUT_ERROR_MESSAGE.FAILED_TO_LOGOUT);
  }
};

export default postLogout;
