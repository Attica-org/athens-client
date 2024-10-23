'use server';

// import tokenManager from '@/utils/tokenManager';
import getKey from '@/utils/getKey';
// import getToken from './getToken';
// import retryConfig from './retryConfig';
import { getSession, updateSession } from '@/serverActions/auth';
import { AUTHORIZATION_FAIL } from '@/constants/AuthErrorMessage';

export const getReissuanceToken = async () => {
  // 비동기 작업을 병렬로 실행
  const [key, session] = await Promise.all([getKey(), getSession()]);

  const res = await fetch(`${key.BASE_URL}/api/v1/auth/reissue`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session?.user?.accessToken}`,
    },
  });

  if (!res.ok) {
    // 토큰 재발급 실패
    // 토큰 재발급이 실패하면 로그아웃 처리
    return AUTHORIZATION_FAIL;

    //   const result = await res.json();

    // if (result.error.code === 1003 || result.error.code === 1202) {
    //   if (retryConfig.tokenReissuance > 0) {
    //     retryConfig.tokenReissuance -= 1;
    //     await getToken();
    //     await getReissuanceToken();
    //   }
    // } else if (result.error.code === 1201) {
    //   if (
    //     result.error.message === 'Invalid JWT signature.' ||
    //     result.error.message === 'Unsupported JWT token.'
    //   ) {
    //     if (retryConfig.tokenReissuance > 0) {
    //       retryConfig.tokenReissuance -= 1;
    //       await getToken();
    //       await getReissuanceToken();
    //     }
    //   }
    // } else {
    //   showToast('인증 오류가 발생했습니다.', 'error');
    // }

    // if (retryConfig.tokenReissuance < 1) {
    //   showToast('인증 오류가 발생했습니다.', 'error');
    //   retryConfig.retry = 0;
    //   retryConfig.tokenReissuance = 3;
    // }

    // return;
  }

  //   retryConfig.tokenReissuance = 3;
  const result = await res.json();

  await updateSession(result.response);
  return 'AUTH_SUCCESS';
  //   tokenManager.setToken(result.response);
};
