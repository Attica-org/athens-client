import getKey from '@/utils/getKey';
import showToast from '@/utils/showToast';
import tokenManager from '@/utils/tokenManager';
import retryConfig from './retryConfig';
// eslint-disable-next-line import/prefer-default-export

const getToken = async () => {
  const key = await getKey();

  const res = await fetch(`${key.BASE_URL}/api/v1/temp-user`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!res.ok) {
    const result = await res.json();
    if (
      result.error.code === 1201 ||
      result.error.code === 1002 ||
      result.error.code === 1202
    ) {
      if (
        result.error.message === 'Invalid JWT signature.' ||
        result.error.message === 'Unsupported JWT token.'
      ) {
        if (retryConfig.retry > 0) {
          retryConfig.retry -= 1;
          await getToken();
        }
      }
    } else {
      showToast('인증 오류가 발생했습니다.', 'error');
    }

    if (retryConfig.retry < 1) {
      showToast('인증 오류가 발생했습니다.', 'error');
      retryConfig.retry = 3;
    }

    return;
  }

  retryConfig.retry = 3;
  const result = await res.json();

  tokenManager.setToken(result.response.accessToken);
};

export default getToken;
