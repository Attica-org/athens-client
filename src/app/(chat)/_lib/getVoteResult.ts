/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/naming-convention */
import fetchWrapper from '@/lib/fetchWrapper';
import { getToken } from '@/lib/getToken';
import showToast from '@/utils/showToast';
import tokenManager from '@/utils/tokenManager';
import { QueryFunction } from '@tanstack/react-query';

type VoteResult = {
  id: number;
  prosCount: number;
  consCount: number;
};

// eslint-disable-next-line import/prefer-default-export
export const getVoteResult: QueryFunction<
  VoteResult,
  [string, string, string]
> = async ({ queryKey }) => {
  const [_1, agoraId] = queryKey;

  // 토큰을 가지고 있는지 확인
  if (tokenManager.getToken() === undefined) {
    await getToken();
  }

  const res = await fetchWrapper.call(
    `/api/v1/auth/agoras/${agoraId}/results`,
    {
      next: {
        tags: ['agora', agoraId, 'closed'],
      },
      credentials: 'include',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenManager.getToken()}`,
      },
    },
  );

  if (res.success === false) {
    if (res.error.code === 1301) {
      showToast('아고라를 찾을 수 없습니다.', 'error');
    } else {
      showToast(
        '투표 데이터를 얻어오는데 실패했습니다.\n다시 시도해주세요.',
        'error',
      );
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
