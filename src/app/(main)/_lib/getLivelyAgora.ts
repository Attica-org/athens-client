import { AGORA_ACTIVE } from '@/constants/responseErrorMessage';
import { callFetchWrapper } from '@/lib/fetchWrapper';

export const getLivelyAgora = async () => {
  const res = await callFetchWrapper('/api/v1/open/agoras/active', {
    next: {
      tags: ['agoras', 'lively'],
    },
    credentials: 'include',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok && !res.success) {
    if (!res.error) {
      throw new Error(AGORA_ACTIVE.UNKNOWN_ERROR);
    }

    if (res.error.code === 1002) {
      throw new Error(AGORA_ACTIVE.BAD_REQUEST);
    }
  }

  if (res.response.agoras) {
    return res.response.agoras;
  }

  // 인기 아고라가 없을 땐 빈 배열 반환
  return [];
};
