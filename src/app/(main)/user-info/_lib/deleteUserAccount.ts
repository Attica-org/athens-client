import { SIGNIN_REQUIRED } from '@/constants/authErrorMessage';
import { DELETE_USER_ERROR_MESSAGE } from '@/constants/responseErrorMessage';
import { callFetchWrapper } from '@/lib/fetchWrapper';
import { getSession } from '@/serverActions/auth';
import isNull from '@/utils/validation/validateIsNull';

const deleteUserAccount = async (memberId: number) => {
  const session = await getSession();

  if (isNull(session)) {
    throw new Error(SIGNIN_REQUIRED);
  }

  const res = await callFetchWrapper(`/api/v1/auth/member/${memberId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.user?.accessToken}`,
    },
    credentials: 'include',
  });

  if (!res.ok && isNull(res.error?.message)) {
    if (isNull(res.error)) {
      throw new Error(DELETE_USER_ERROR_MESSAGE.UNKNOWN_ERROR);
    }

    if (res.error.code === 1301) {
      throw new Error(DELETE_USER_ERROR_MESSAGE.NOT_FOUND_USER);
    }
  }
};

export default deleteUserAccount;
