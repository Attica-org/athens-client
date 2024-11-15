/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/naming-convention */
import { AgoraUserProfileType } from '@/app/model/Agora';
import { QueryFunction } from '@tanstack/react-query';
import { getAgoraUserListQueryKey as getAgoraUserListTags } from '@/constants/queryKey';
import { callFetchWrapper } from '@/lib/fetchWrapper';
import { getSession } from '@/serverActions/auth';
import { SIGNIN_REQUIRED } from '@/constants/authErrorMessage';
import { AGORA_USER } from '@/constants/responseErrorMessage';
import isNull from '@/utils/isNull';

export const getAgoraUsers: QueryFunction<
  AgoraUserProfileType[],
  [string, string, string]
> = async ({ queryKey }) => {
  const [_1, _2, agoraId] = queryKey;

  const session = await getSession();
  if (isNull(session)) {
    throw new Error(SIGNIN_REQUIRED);
  }

  const res = await callFetchWrapper(`/api/v1/open/agoras/${agoraId}/users`, {
    next: {
      tags: getAgoraUserListTags(Number(agoraId)),
    },
    credentials: 'include',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok && !res.success) {
    if (!res.error) {
      throw new Error(AGORA_USER.UNKNOWN_ERROR);
    }

    if (res.error.code === 1301) {
      throw new Error(AGORA_USER.NOT_FOUND_AGORA);
    } else if (res.error.code === -1) {
      throw new Error(res.error.message);
    }

    throw new Error(AGORA_USER.FAILED_TO_GET_AGORA_USER);
  }

  const result = res.response.participants;

  return result;
};
