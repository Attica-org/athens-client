import showToast from '@/utils/showToast';
import tokenManager from '@/utils/tokenManager';
import getKey from '@/utils/getKey';
import { getToken } from './getToken';

let retry = 3;

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
      if (retry > 0) {
        await getToken();
        await getReissuanceToken();
        retry -= 1;
      }
    } else if (result.error.code === 1201) {
      if (result.error.message === 'Invalid JWT signature.' || result.error.message === 'Unsupported JWT token.') {
        if (retry > 0) {
          retry -= 1;
          await getToken();
          await getReissuanceToken();
        }
      }
    } else {
      showToast('인증 오류가 발생했습니다.', 'error');
    }

    if (retry <= 0) {
      showToast('인증 오류가 발생했습니다.', 'error');
      retry = 3;
    }

    return;
  }

  retry = 3;
  const result = await res.json();

  console.log('result.response', result.response);
  tokenManager.setToken(result.response);
};
