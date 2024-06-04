import fetchWrapper from '@/lib/fetchWrapper';
import { getToken } from '@/lib/getToken';
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
    console.log(res.error.message);
    throw new Error('Network response was not ok');
  }

  const result = res.response;

  return result;
};
