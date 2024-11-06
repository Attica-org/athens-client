import { getSession, updateSession } from '@/serverActions/auth';
import {
  AUTHORIZATION_FAIL,
  AUTHORIZATION_SUCCESS,
} from '@/constants/authErrorMessage';
import { callFetchWrapper } from './fetchWrapper';

export const getReissuanceToken = async () => {
  const session = await getSession();
  if (!session) {
    return AUTHORIZATION_FAIL;
  }

  const res = await callFetchWrapper('/api/v1/auth/reissue', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.user.accessToken}`,
    },
  });

  console.log('res', res);

  if (!res.ok && !res.success) {
    // 토큰 재발급 실패
    // 토큰 재발급이 실패하면 로그아웃 처리
    return AUTHORIZATION_FAIL;
  }

  try {
    await updateSession(res.response);
    // await updateSession(res.response);
  } catch (error) {
    console.log('jwt update error', error);
  }
  return AUTHORIZATION_SUCCESS;
};
