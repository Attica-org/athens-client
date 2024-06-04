import tokenManager from '@/utils/tokenManager';

// eslint-disable-next-line import/prefer-default-export
export const getReissuanceToken = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/reissue`, {
    method: 'POST',
    credentials: 'include',
  });

  if (!res.ok) {
    console.log(res);
    throw new Error('Network response was not ok');
  }

  const result = await res.json();

  tokenManager.setToken(result.accessToken);
};
