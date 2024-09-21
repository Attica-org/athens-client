import fetchWrapper from '@/lib/fetchWrapper';
import getToken from '@/lib/getToken';
import showToast from '@/utils/showToast';
import tokenManager from '@/utils/tokenManager';
import { AgoraConfig } from '@/app/model/Agora';

const TITLE_NULL = { title: '공백일 수 없습니다' };
const CATEGORY_ERROR = { capacity: '1 이상이어야 합니다' };
const COLOR_NULL = { color: '공백일 수 없습니다' };
const CAPACITY_NULL = { categoryId: '널이어서는 안됩니다' };
const DURATION_UNDER_ERROR = { duration: '1 이상이어야 합니다' };
const DURATION_OVER_ERROR = { duration: '180 이하이어야 합니다' };

// eslint-disable-next-line import/prefer-default-export
export const postCreateAgora = async (info: AgoraConfig) => {
  // 토큰을 가지고 있는지 확인
  if (tokenManager.getToken() === undefined) {
    await getToken();
  }

  const res = await fetchWrapper.call('/api/v1/auth/agoras', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${tokenManager.getToken()}`,
    },
    credentials: 'include',
    body: JSON.stringify({
      title: info.title,
      categoryId: info.category,
      color: info.color.value,
      capacity: info.capacity,
      duration: info.duration,
    }),
  });

  if (res.success === false) {
    if (res.error.code === 1001) {
      if (Number(info.category) < 1 || res.error.message === CATEGORY_ERROR) {
        showToast('허용되지 않는 카테고리입니다.', 'error');
      } else if (info.color === null || res.error.message === COLOR_NULL) {
        showToast('아고라 색상을 선택해주세요.', 'error');
      } else if (
        info.capacity === null ||
        res.error.message === CAPACITY_NULL
      ) {
        showToast('카테고리를 선택해주세요.', 'error');
      } else if (
        info.title.trim() === null ||
        res.error.message === TITLE_NULL
      ) {
        showToast('아고라 제목을 입력해주세요.', 'error');
      } else if (
        info.duration === null ||
        info.duration < 1 ||
        res.error.message === DURATION_UNDER_ERROR
      ) {
        showToast('토론 시간을 입력해주세요.', 'error');
      } else if (
        info.duration === null ||
        info.duration > 180 ||
        res.error.message === DURATION_OVER_ERROR
      ) {
        showToast('토론 시간을 180분 이하로 입력해주세요.', 'error');
      } else {
        showToast('생성 실패했습니다.\n 다시 시도해주세요.', 'error');
      }
      return null;
    }

    return null;
  }

  const result = res.response;

  return result;
};
