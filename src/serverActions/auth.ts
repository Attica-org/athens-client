'use server';

import { auth, signOut, update } from '@/auth';

export const signInWithCredentials = async (tempToken: string) => {
  if (tempToken) {
    // temp-token으로 백엔드에서 access token 요청
    const tokenResponse = await fetch(
      `${process.env.NEXT_BASE_URL}/api/v1/open/member/token?temp-token=${tempToken}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      },
    );

    const tokenResult = await tokenResponse.json();

    if (!tokenResult.accessToken) {
      return tokenResult;
    }

    const result = {
      success: true,
      accessToken: tokenResult.accessToken,
    };

    return result;
  }

  return {
    success: false,
    message: 'failed to login',
  };
};

export const signOutWithCredentials = async () => {
  await signOut();
};

export const getSession = async () => {
  return auth();
};

export const updateSession = async (session: string) => {
  await update({
    user: {
      accessToken: session,
    },
  });
};
