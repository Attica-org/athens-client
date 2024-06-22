/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/naming-convention */
import { AgoraUser } from '@/app/model/AgoraUser';
import fetchWrapper from '@/lib/fetchWrapper';
import getToken from '@/lib/getToken';
import showToast from '@/utils/showToast';
import tokenManager from '@/utils/tokenManager';
import { QueryFunction } from '@tanstack/react-query';

// eslint-disable-next-line import/prefer-default-export
export const getAgoraUsers: QueryFunction<
  AgoraUser[],
  [string, string, string]
> = async ({ queryKey }) => {
  const [_1, _2, agoraId] = queryKey;

  // 토큰을 가지고 있는지 확인
  if (tokenManager.getToken() === undefined) {
    await getToken();
  }

  const res = await fetchWrapper.call(`/api/v1/open/agoras/${agoraId}/users`, {
    next: {
      tags: ['chat', 'users', `${agoraId}`],
    },
    credentials: 'include',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (res.success === false) {
    if (res.error.code === 1301) {
      showToast('해당 아고라를 찾을 수 없습니다.', 'error');
    } else if (res.error.code === -1) {
      throw new Error(res.error.message);
    } else {
      showToast('참여 사용자를 불러올 수 없습니다.', 'error');
    }

    return [];
  }

  const result = res.response.participants;

  return result;
};
