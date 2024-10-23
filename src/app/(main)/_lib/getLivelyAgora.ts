import { callFetchWrapper } from '@/lib/fetchWrapper';
import showToast from '@/utils/showToast';

// eslint-disable-next-line import/prefer-default-export
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

  if (res.success === false) {
    if (res.error.code === 1002) {
      showToast('잘못된 요청입니다.', 'error');
    }
  }

  if (res.response.agoras) {
    return res.response.agoras;
  }

  // 인기 아고라가 없을 땐 빈 배열 반환
  return res.response;
};
