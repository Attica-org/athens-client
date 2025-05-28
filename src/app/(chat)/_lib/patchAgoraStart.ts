import { AgoraId } from '@/app/model/Agora';
import { AUTH_MESSAGE, SIGNIN_REQUIRED } from '@/constants/authErrorMessage';
import {
  AGORA_START,
  NETWORK_ERROR_MESSAGE,
} from '@/constants/responseErrorMessage';
import { callFetchWrapper } from '@/lib/fetchWrapper';
import { getSession } from '@/serverActions/auth';
import isNull from '@/utils/validation/validateIsNull';

type PatchAgoraStartArg = {
  agoraId: AgoraId;
};

type StartDiscussionResponse = {
  agoraId: AgoraId;
  startTime: string;
};

export const patchAgoraStart = async ({
  agoraId,
}: PatchAgoraStartArg): Promise<StartDiscussionResponse> => {
  const session = await getSession();
  if (isNull(session)) {
    throw new Error(SIGNIN_REQUIRED);
  }

  const res = await callFetchWrapper<StartDiscussionResponse>(
    `/api/v1/auth/agoras/${agoraId}/start`,
    {
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
    },
  );

  if (!res.ok && !res.success) {
    if (!res.error) {
      throw new Error(AGORA_START.UNKNOWN_ERROR);
    }

    const errorMessage =
      typeof res.error.message === 'string' ? res.error.message : 'ERROR';

    if (res.error.code === 1002) {
      throw new Error(AGORA_START.ALREADY_RUNNING_OR_ENDED);
    } else if (res.error.code === 1301) {
      throw new Error(AGORA_START.NOT_FOUND_AGORA_OR_USER);
    } else if (res.error.code === 1102) {
      throw new Error(AGORA_START.OBSERVER_CANNOT_START);
    } else if (res.error.code === 503) {
      throw new Error(NETWORK_ERROR_MESSAGE.OFFLINE);
    } else if (AUTH_MESSAGE.includes(errorMessage)) {
      throw new Error(errorMessage);
    }

    throw new Error(AGORA_START.FAILED_TO_START_AGORA);
    // return null;
  }

  if (isNull(res.response)) {
    throw new Error(AGORA_START.UNKNOWN_ERROR);
  }

  const result = res.response;

  return result;
};
