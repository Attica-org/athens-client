import { AgoraId } from '@/app/model/Agora';
import { AUTH_MESSAGE, SIGNIN_REQUIRED } from '@/constants/authErrorMessage';
import {
  AGORA_TIME_OUT,
  NETWORK_ERROR_MESSAGE,
} from '@/constants/responseErrorMessage';
import { callFetchWrapper } from '@/lib/fetchWrapper';
import { getSession } from '@/serverActions/auth';
import isNull from '@/utils/validation/validateIsNull';

type PatchAgoraTimeOutArg = {
  agoraId: AgoraId;
};

type TimeOutDiscussionResponse = {
  agoraId: AgoraId;
  isClosed: boolean;
  endTime: string;
};

export const patchAgoraTimeOut = async ({ agoraId }: PatchAgoraTimeOutArg) => {
  const session = await getSession();
  if (isNull(session)) {
    throw new Error(SIGNIN_REQUIRED);
  }

  const res = await callFetchWrapper<TimeOutDiscussionResponse>(
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

    const errorMessage =
      typeof res.error.message === 'string' ? res.error.message : 'ERROR';

    if (res.error.code === 1301) {
      throw new Error(AGORA_TIME_OUT.NOT_FOUND_AGORA);
    } else if (res.error.code === 1002) {
      throw new Error(AGORA_TIME_OUT.ALREADY_TIME_OUT);
    } else if (res.error.code === 503) {
      throw new Error(NETWORK_ERROR_MESSAGE.OFFLINE);
    } else if (AUTH_MESSAGE.includes(errorMessage)) {
      throw new Error(errorMessage);
    }

    throw new Error(AGORA_TIME_OUT.FAILED_TO_TIME_OUT);

    // return null;
  }

  if (isNull(res.response)) {
    throw new Error(AGORA_TIME_OUT.UNKNOWN_ERROR);
  }

  const result = res.response;

  return result;
};
