import { AgoraMemberInfo } from '@/app/model/AgoraMeta';
import { SIGNIN_REQUIRED } from '@/constants/authErrorMessage';
import { DELETE_USER_ERROR_MESSAGE } from '@/constants/responseErrorMessage';
import { callFetchWrapper } from '@/lib/fetchWrapper';
import { getSession } from '@/serverActions/auth';
import isNull from '@/utils/validation/validateIsNull';

type DeleteUserResponse = {
  memberId: AgoraMemberInfo['memberId'];
  isDeleted: true;
  deletedAt: string;
  deletedBy: string;
};

const deleteUserAccount = async (): Promise<void> => {
  const session = await getSession();

  if (isNull(session)) {
    throw new Error(SIGNIN_REQUIRED);
  }

  const res = await callFetchWrapper<DeleteUserResponse>(
    '/api/v1/auth/member',
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.user?.accessToken}`,
      },
      credentials: 'include',
    },
  );

  if (!res.ok && !res.success) {
    if (!res.error) {
      throw new Error(DELETE_USER_ERROR_MESSAGE.UNKNOWN_ERROR);
    }

    if (res.error.code === 1301) {
      throw new Error(DELETE_USER_ERROR_MESSAGE.NOT_FOUND_USER);
    }

    if (isNull(res.error)) {
      throw new Error(DELETE_USER_ERROR_MESSAGE.UNKNOWN_ERROR);
    }

    throw new Error(DELETE_USER_ERROR_MESSAGE.FAILED_TO_DELETE_USER);
  }
};

export default deleteUserAccount;
