import { callFetchWrapper } from '@/lib/fetchWrapper';
import { AUTH_MESSAGE, SIGNIN_REQUIRED } from '@/constants/authErrorMessage';
import { getSession } from '@/serverActions/auth';
import {
  AGORA_ENTER,
  NETWORK_ERROR_MESSAGE,
} from '@/constants/responseErrorMessage';
import isNull from '@/utils/validation/validateIsNull';

export const postEnterClosedAgora = async (agoraId: number) => {
  const session = await getSession();
  if (isNull(session)) {
    throw new Error(SIGNIN_REQUIRED);
  }

  const res = await callFetchWrapper<any>(
    `/api/v1/auth/agoras/${agoraId}/closed/participants`,
    {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.user?.accessToken}`,
      },
      credentials: 'include',
    },
  );

  if (!res.ok && !res.success) {
    if (!res.error) {
      throw new Error(AGORA_ENTER.UNKNOWN_ERROR);
    }

    const errorMessage =
      typeof res.error.message === 'string' ? res.error.message : 'ERROR';

    if (AUTH_MESSAGE.includes(errorMessage)) {
      throw new Error(errorMessage);
    }
    if (res.error.code === 1002) {
      throw new Error(AGORA_ENTER.ACTIVATE_AGORA);
    }
    if (res.error.code === 503) {
      throw new Error(NETWORK_ERROR_MESSAGE.OFFLINE);
    }

    throw new Error(AGORA_ENTER.FAILED_TO_ENTER_AGORA);
  }

  const result = res.response;

  return result;
};
