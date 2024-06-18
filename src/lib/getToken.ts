import getKey from '@/utils/getKey';
import showToast from '@/utils/showToast';
import tokenManager from '@/utils/tokenManager';

let retry = 3;

// eslint-disable-next-line import/prefer-default-export
export const getToken = async () => {
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
    if (result.error.code === 1201 || result.error.code === 1002 || result.error.code === 1202) {
      if (result.error.message === 'Invalid JWT signature.' || result.error.message === 'Unsupported JWT token.') {
        if(retry > 0) {
          retry--;
          await getToken();
        }
      }
    } else {
      showToast('인증 오류가 발생했습니다.', 'error');
    }

    if(retry <= 0) {
      showToast('인증 오류가 발생했습니다.', 'error');
      retry = 3;
    }

    return;
  }

  retry = 3;
  const result = await res.json();

  console.log('accessToken 발급: ', result.response.accessToken);

  tokenManager.setToken(result.response.accessToken);
};
