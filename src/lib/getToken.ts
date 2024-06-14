import showToast from '@/utils/showToast';
import tokenManager from '@/utils/tokenManager';

// eslint-disable-next-line import/prefer-default-export
export const getToken = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/temp-user`, {
    method: 'POST',
    credentials: 'include',
  });

  if (!res.ok) {
    const result = await res.json();
    if (result.error.code === 1201 || result.error.code === 1002) {
      if (result.error.message === 'Invalid JWT signature.' || result.error.message === 'Unsupported JWT token.') {
        await getToken();
      }
    } else {
      showToast('인증 오류가 발생했습니다.', 'error');
    }

    return;
  }

  const result = await res.json();

  tokenManager.setToken(result.response.accessToken);
};
