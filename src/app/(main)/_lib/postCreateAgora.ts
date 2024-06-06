import fetchWrapper from '@/lib/fetchWrapper';
import { getToken } from '@/lib/getToken';
import showToast from '@/utils/showToast';
import tokenManager from '@/utils/tokenManager';

type Props = {
  title: string,
  category: string,
  color: string,
  capacity: number,
  duration: number | null,
};

// eslint-disable-next-line import/prefer-default-export
export const postCreateAgora = async (info: Props) => {
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
      color: info.color,
      capacity: info.capacity,
      duration: info.duration,
    }),
  });

  if (res.success === false) {
    if (res.error.code === 1001) {
      if (Number(info.category) < 1) {
        showToast('허용되지 않는 카테고리입니다.', 'error');
      } else if (info.color === null) {
        showToast('아고라 색상을 선택해주세요.', 'error');
      } else if (info.capacity === null) {
        showToast('카테고리를 선택해주세요.', 'error');
      } else {
        showToast('생성 실패했습니다.\n 다시 시도해주세요.', 'error');
      }
    }
  }

  const result = res.response;

  return result;
};
