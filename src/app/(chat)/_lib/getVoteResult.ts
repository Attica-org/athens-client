/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/naming-convention */
import { QueryFunction } from '@tanstack/react-query';
import { getVoteResultQueryKey as getVoteResultTags } from '@/constants/queryKey';
import { callFetchWrapper } from '@/lib/fetchWrapper';
import { getSession } from '@/serverActions/auth';
import { SIGNIN_REQUIRED } from '@/constants/authErrorMessage';
import { VOTE_RESULT } from '@/constants/responseErrorMessage';
import isNull from '@/utils/validation/validateIsNull';

type VoteResult = {
  id: number;
  prosCount: number;
  consCount: number;
};

export const getVoteResult: QueryFunction<
  VoteResult,
  [string, string, string]
> = async ({ queryKey }) => {
  const [_1, agoraId] = queryKey;

  const session = await getSession();
  if (isNull(session)) {
    throw new Error(SIGNIN_REQUIRED);
  }

  const res = await callFetchWrapper(`/api/v1/auth/agoras/${agoraId}/results`, {
    next: {
      tags: getVoteResultTags(Number(agoraId)),
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
      throw new Error(VOTE_RESULT.UNKNOWN_ERROR);
    }

    if (res.error.code === 1301) {
      throw new Error(VOTE_RESULT.NOT_FOUND_AGORA);
    }

    return {
      id: agoraId,
      prosCount: 0,
      consCount: 0,
    };
  }

  const result = res.response;

  return result;
};
