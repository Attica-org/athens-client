import showToast from '@/utils/showToast';
import tokenManager from '@/utils/tokenManager';
import getKey from '@/utils/getKey';
import getToken from './getToken';
import retryConfig from './retryConfig';

// eslint-disable-next-line import/prefer-default-export
export const getReissuanceToken = async () => {
  const key = await getKey();

  const res = await fetch(`${key.BASE_URL}/api/v1/auth/reissue`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${tokenManager.getToken()}`,
    },
  });

  if (!res.ok) {
    const result = await res.json();
    if (result.error.code === 1003 || result.error.code === 1202) {
      if (retryConfig.retry > 0) {
        await getToken();
        await getReissuanceToken();
        retryConfig.retry -= 1;
        console.log('retryConfig는', retryConfig.retry);
      }
    } else if (result.error.code === 1201) {
      if (
        result.error.message === 'Invalid JWT signature.' ||
        result.error.message === 'Unsupported JWT token.'
      ) {
        if (retryConfig.retry > 0) {
          retryConfig.retry -= 1;
          await getToken();
          await getReissuanceToken();
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

  tokenManager.setToken(result.response);
};
