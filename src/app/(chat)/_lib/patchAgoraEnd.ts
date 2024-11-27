import { SIGNIN_REQUIRED } from '@/constants/authErrorMessage';
import {
  AGORA_END,
  NETWORK_ERROR_MESSAGE,
} from '@/constants/responseErrorMessage';
import { callFetchWrapper } from '@/lib/fetchWrapper';
import { getSession } from '@/serverActions/auth';
import isNull from '@/utils/validation/validateIsNull';

export const patchAgoraEnd = async (agoraId: number) => {
  const session = await getSession();
  if (isNull(session)) {
    throw new Error(SIGNIN_REQUIRED);
  }

  const res = await callFetchWrapper(`/api/v1/auth/agoras/${agoraId}/close`, {
    method: 'PATCH',
    next: {
      tags: [],
    },
    credentials: 'include',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.user?.accessToken}`,
    },
  });

  if (!res.ok && !res.success) {
    if (!res.error) {
      throw new Error(AGORA_END.UNKNOWN_ERROR);
    }

    if (res.error.code === 1301) {
      throw new Error(AGORA_END.NOT_FOUND_AGORA_OR_USER);
    } else if (res.error.code === 1002) {
      if (res.error.message === AGORA_END.SERVER_RESPONSE_AGORA_STATUS_ERROR) {
        throw new Error(AGORA_END.ALREADY_ENDED);
      } else if (
        res.error.message === AGORA_END.SERVER_RESPONSE_ALREADY_VOTED
      ) {
        throw new Error(AGORA_END.ALREADY_VOTED);
      }
    } else if (res.error.code === 1102) {
      throw new Error(AGORA_END.OBSERVER_CANNOT_END);
    } else if (res.error.code === 503) {
      throw new Error(NETWORK_ERROR_MESSAGE.OFFLINE);
    }

    throw new Error(AGORA_END.NOT_FOUND_AGORA_OR_USER);

    // return null;
  }

  const result = res.response;

  return result;
};
