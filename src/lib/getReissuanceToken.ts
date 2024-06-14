import showToast from '@/utils/showToast';
import tokenManager from '@/utils/tokenManager';
import { getToken } from './getToken';

// eslint-disable-next-line import/prefer-default-export
export const getReissuanceToken = async () => {
  if (!tokenManager.getToken()) {
    await getToken();
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/auth/reissue`, {
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
      await getToken();
      await getReissuanceToken();
    } else if (result.error.code === 1201) {
      if (result.error.message === 'Invalid JWT signature.' || result.error.message === 'Unsupported JWT token.') {
        await getToken();
        await getReissuanceToken();
      }
    } else {
      showToast('인증 오류가 발생했습니다.', 'error');
    }

    return;
  }

  const result = await res.json();

  tokenManager.setToken(result.accessToken);
};
