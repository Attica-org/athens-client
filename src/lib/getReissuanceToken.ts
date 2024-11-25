import { callFetchWrapper } from './fetchWrapper';

export const getReissuanceToken = async (token: string) => {
  const res = await callFetchWrapper('/api/v1/auth/reissue', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok && !res.success) {
    // 토큰 재발급 실패
    // 토큰 재발급이 실패하면 로그아웃 처리
    return {
      success: false,
      newAccessToken: null,
    };
  }

  return {
    success: true,
    newAccessToken: res.response,
  };
};
