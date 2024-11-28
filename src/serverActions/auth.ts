'use server';

import { auth, signOut, update } from '@/auth';

export const signInWithCredentials = async (tempToken: string) => {
  if (tempToken) {
    // temp-token으로 백엔드에서 access token 요청
    const tokenResponse = await fetch(
      `${process.env.NEXT_BASE_URL}/api/v1/open/member/token?temp-token=${tempToken}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      },
    );

    if (tokenResponse.ok) {
      const tokenResult = await tokenResponse.json();

      const result = {
        success: true,
        accessToken: tokenResult.accessToken,
      };

      return result;
    }
  }

  return {
    success: false,
    accessToken: '',
  };
};

export const signOutWithCredentials = async () => {
  await signOut({ redirect: true });
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
