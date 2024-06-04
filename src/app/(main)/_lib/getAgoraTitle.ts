/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/naming-convention */
import fetchWrapper from '@/lib/fetchWrapper';
import { getToken } from '@/lib/getToken';
import tokenManager from '@/utils/tokenManager';
import { QueryFunction } from '@tanstack/react-query';

// eslint-disable-next-line import/prefer-default-export
export const getAgoraTitle:QueryFunction<
{ title: string, status: string }, [_1: string, _2: string]> = async ({ queryKey }) => {
  const [agoraId, _] = queryKey;

  // 토큰을 가지고 있는지 확인
  if (tokenManager.getToken() === undefined) {
    await getToken();
  }

  const res = await fetchWrapper.call('/api/v1/auth/title', {
    next: {
      tags: [`${agoraId}`, 'agoraTitle'],
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

  const result = res.response;

  return result;
};
