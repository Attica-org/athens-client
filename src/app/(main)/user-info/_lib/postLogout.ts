import { SIGNIN_REQUIRED } from '@/constants/authErrorMessage';
import { LOGOUT_ERROR_MESSAGE } from '@/constants/responseErrorMessage';
import { callFetchWrapper } from '@/lib/fetchWrapper';
import { getSession } from '@/serverActions/auth';
import isNull from '@/utils/validation/validateIsNull';

const postLogout = async () => {
  const session = await getSession();
  if (isNull(session)) {
    throw new Error(SIGNIN_REQUIRED);
  }

  const res = await callFetchWrapper('/api/v1/auth/member/logout', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.user?.accessToken}`,
    },
    credentials: 'include',
  });

  if (!res.ok && res.error?.message) {
    if (res.error.code === 1201) {
      throw new Error(LOGOUT_ERROR_MESSAGE.EXPIRED_TOKEN);
    }

    if (!res.error) {
      throw new Error(LOGOUT_ERROR_MESSAGE.UNKNOWN_ERROR);
    }
  }
};

export default postLogout;
