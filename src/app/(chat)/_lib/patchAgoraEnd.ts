import { AgoraId } from '@/app/model/Agora';
import { AUTH_MESSAGE, SIGNIN_REQUIRED } from '@/constants/authErrorMessage';
import {
  AGORA_END,
  NETWORK_ERROR_MESSAGE,
} from '@/constants/responseErrorMessage';
import { callFetchWrapper } from '@/lib/fetchWrapper';
import { getSession } from '@/serverActions/auth';
import isNull from '@/utils/validation/validateIsNull';

type PatchAgoraEndArg = {
  agoraId: AgoraId;
};

type EndDiscussionResponse = {
  agoraId: AgoraId;
  endVoteCount: number;
  isClosed: boolean;
  endTime: string | null;
};

export const patchAgoraEnd = async ({
  agoraId,
}: PatchAgoraEndArg): Promise<EndDiscussionResponse> => {
  const session = await getSession();
  if (isNull(session)) {
    throw new Error(SIGNIN_REQUIRED);
  }

  const res = await callFetchWrapper<EndDiscussionResponse>(
    `/api/v1/auth/agoras/${agoraId}/close`,
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
      throw new Error(AGORA_END.UNKNOWN_ERROR);
    }

    const errorMessage =
      typeof res.error.message === 'string' ? res.error.message : 'ERROR';

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
    } else if (AUTH_MESSAGE.includes(errorMessage)) {
      throw new Error(errorMessage);
    }

    throw new Error(AGORA_END.NOT_FOUND_AGORA_OR_USER);

    // return null;
  }

  if (isNull(res.response)) {
    throw new Error(AGORA_END.UNKNOWN_ERROR);
  }

  const result = res.response;

  return result;
};
