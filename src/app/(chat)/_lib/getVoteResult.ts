/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/naming-convention */
import { QueryFunction } from '@tanstack/react-query';
import { getVoteResultQueryKey as getVoteResultTags } from '@/constants/queryKey';
import { callFetchWrapper } from '@/lib/fetchWrapper';
import { getSession } from '@/serverActions/auth';
import { AUTH_MESSAGE, SIGNIN_REQUIRED } from '@/constants/authErrorMessage';
import {
  NETWORK_ERROR_MESSAGE,
  VOTE_RESULT,
} from '@/constants/responseErrorMessage';
import isNull from '@/utils/validation/validateIsNull';
import { ClosedAgora } from '@/app/model/Agora';

type VoteResult = Pick<ClosedAgora, 'id' | 'prosCount' | 'consCount'>;

export const getVoteResult: QueryFunction<
  VoteResult,
  [string, string, string]
> = async ({ queryKey }) => {
  const [_1, agoraId] = queryKey;

  const session = await getSession();
  if (isNull(session)) {
    throw new Error(SIGNIN_REQUIRED);
  }

  const res = await callFetchWrapper<VoteResult>(
    `/api/v1/auth/agoras/${agoraId}/results`,
    {
      next: {
        tags: getVoteResultTags(Number(agoraId)),
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
      throw new Error(VOTE_RESULT.UNKNOWN_ERROR);
    }

    const errorMessage =
      typeof res.error.message === 'string' ? res.error.message : 'ERROR';

    if (res.error.code === 1301) {
      throw new Error(VOTE_RESULT.NOT_FOUND_AGORA);
    } else if (res.error.code === 503) {
      throw new Error(NETWORK_ERROR_MESSAGE.OFFLINE);
    } else if (AUTH_MESSAGE.includes(errorMessage)) {
      throw new Error(errorMessage);
    }

    return {
      id: Number(agoraId),
      prosCount: 0,
      consCount: 0,
    };
  }

  if (isNull(res.response)) {
    throw new Error(VOTE_RESULT.UNKNOWN_ERROR);
  }

  const result = res.response;

  return result;
};
