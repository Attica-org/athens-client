import {
  AUTHORIZATION_FAIL,
  AUTHORIZATION_SUCCESS,
} from '@/constants/authErrorMessage';
import { getReissuanceToken } from '@/lib/getReissuanceToken';
import isNull from '@/utils/validation/validateIsNull';
import { useSession } from 'next-auth/react';

const useUpdateSession = () => {
  const { data: session, update } = useSession();

  const callReissueFn = async () => {
    if (isNull(session) || isNull(session?.user)) {
      return AUTHORIZATION_FAIL;
    }

    const result = await getReissuanceToken(session.user.accessToken);
    if (!result.success) {
      return AUTHORIZATION_FAIL;
    }
    await update({
      ...session,
      user: {
        ...session.user,
        accessToken: result.newAccessToken,
      },
    });

    return AUTHORIZATION_SUCCESS;
  };

  return { callReissueFn };
};

export default useUpdateSession;
