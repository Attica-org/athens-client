import fetchWrapper from '@/lib/fetchWrapper';
import { getToken } from '@/lib/getToken';
import showToast from '@/utils/showToast';
import tokenManager from '@/utils/tokenManager';

const AGORA_STATUS_ERROR = 'Agora status must be RUNNING';
const ALREADY_VOTED = 'User has already voted for ending the agora';

// eslint-disable-next-line import/prefer-default-export
export const patchAgoraEnd = async (agoraId: number) => {
  // 토큰을 가지고 있는지 확인
  if (tokenManager.getToken() === undefined) {
    await getToken();
  }

  const res = await fetchWrapper.call(`/api/v1/auth/agoras/${agoraId}/close`, {
    method: 'PATCH',
    next: {
      tags: [],
    },
    credentials: 'include',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${tokenManager.getToken()}`,
    },
  });

  if (res.success === false) {
    if (res.error.code === 1301) {
      showToast('존재하지 않는 아고라 혹은 사용자입니다.', 'error');
    } else if (res.error.code === 1002) {
      if (res.error.message === AGORA_STATUS_ERROR) {
        showToast('이미 종료된 아고라입니다.', 'error');
      } else if (res.error.message === ALREADY_VOTED) {
        showToast('이미 투표한 사용자입니다.', 'error');
      } else {
        showToast('토론 종료에 실패했습니다.\n 다시 시도해주세요.', 'error');
      }
    } else if (res.error.code === 1102) {
      showToast('관찰자는 토론을 종료할 수 없습니다.', 'error');
    } else {
      showToast('토론 종료에 실패했습니다.\n 다시 시도해주세요.', 'error');
    }
    return null;
  }

  const result = res.response;

  return result;
};
