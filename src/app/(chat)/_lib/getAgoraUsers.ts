/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/naming-convention */
import { AgoraUser } from '@/app/model/AgoraUser';
import fetchWrapper from '@/lib/fetchWrapper';
import { getToken } from '@/lib/getToken';
import tokenManager from '@/utils/tokenManager';
import { QueryFunction } from '@tanstack/react-query';

// eslint-disable-next-line import/prefer-default-export
export const getAgoraUsers: QueryFunction<
AgoraUser[], [string, string, string]
> = async ({ queryKey }) => {
  const [_1, _2, agoraId] = queryKey;

  // 토큰을 가지고 있는지 확인
  if (tokenManager.getToken() === undefined) {
    await getToken();
  }

  const res = await fetchWrapper.call(`/api/v1/auth/agoras/${agoraId}/users`, {
    next: {
      tags: ['chat', 'users', `${agoraId}`],
    },
    credentials: 'include',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${tokenManager.getToken()}`,
    },
  });

  if (res.success === false) {
    console.log(res.error.message);
    throw new Error('Network response was not ok');
  }

  const result = res.response.participants;

  return result;
};
