import { SIGNIN_REQUIRED } from '@/constants/authErrorMessage';
import { AGORA_TIME_OUT } from '@/constants/responseErrorMessage';
import { callFetchWrapper } from '@/lib/fetchWrapper';
import { getSession } from '@/serverActions/auth';
import isNull from '@/utils/validation/validateIsNull';

export const patchAgoraTimeOut = async (agoraId: number) => {
  const session = await getSession();
  if (isNull(session)) {
    throw new Error(SIGNIN_REQUIRED);
  }

  const res = await callFetchWrapper(
    `/api/v1/open/agoras/${agoraId}/time-out`,
    {
      method: 'PATCH',
      next: {
        tags: [],
      },
      credentials: 'include',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );

  if (!res.ok && !res.success) {
    if (!res.error) {
      throw new Error(AGORA_TIME_OUT.UNKNOWN_ERROR);
    }

    if (res.error.code === 1301) {
      throw new Error(AGORA_TIME_OUT.NOT_FOUND_AGORA);
    } else if (res.error.code === 1002) {
      throw new Error(AGORA_TIME_OUT.ALREADY_TIME_OUT);
    }
    throw new Error(AGORA_TIME_OUT.FAILED_TO_TIME_OUT);

    // return null;
  }

  const result = res.response;

  return result;
};
