import tokenManager from '@/utils/tokenManager';

type Props = {
  tempToken: string;
};

const getMemberToken = async ({ tempToken }: Props) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_BASE_URL}/api/v1/open/member/token?temp-token=${tempToken}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      },
    );

    const result = await res.json();

    if (!res.ok) {
      if (!result.success) {
        return {
          success: false,
        };
      }
    }

    tokenManager.setToken(result.accessToken);
    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
    };
  }
};

export default getMemberToken;
