import fetchWrapper from '@/lib/fetchWrapper';
import { getToken } from '@/lib/getToken';
import showToast from '@/utils/showToast';
import tokenManager from '@/utils/tokenManager';

// eslint-disable-next-line import/prefer-default-export
export const patchAgoraTimeOut = async (agoraId: number) => {
  // 토큰을 가지고 있는지 확인
  if (tokenManager.getToken() === undefined) {
    await getToken();
  }

  const res = await fetchWrapper.call(
    `/api/v1/open/agoras/${agoraId}/time-out`,
    {
      method: 'PATCH',
      next: {
        tags: [],
      },
      credentials: 'include',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );

  if (res.success === false) {
    if (res.error.code === 1301) {
      showToast('존재하지 않는 아고라입니다.', 'error');
    } else if (res.error.code === 1002) {
      showToast('이미 종료된 아고라입니다.', 'error');
    } else {
      showToast('토론 종료에 실패했습니다.\n 다시 시도해주세요.', 'error');
    }
    return null;
  }

  const result = res.response;

  return result;
};
