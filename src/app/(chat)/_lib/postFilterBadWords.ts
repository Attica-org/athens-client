import { SIGNIN_REQUIRED } from '@/constants/authErrorMessage';
import {
  FILTER_BAD_WORDS,
  NETWORK_ERROR_MESSAGE,
} from '@/constants/responseErrorMessage';
import { callFetchWrapper } from '@/lib/fetchWrapper';
import { getSession } from '@/serverActions/auth';
import isNull from '@/utils/validation/validateIsNull';

type Props = {
  message: string;
  agoraId: number;
};

const postFilterBadWords = async ({ message, agoraId }: Props) => {
  const session = await getSession();
  if (isNull(session)) {
    throw new Error(SIGNIN_REQUIRED);
  }

  const res = await callFetchWrapper(
    `/api/v1/auth/agoras/${agoraId}/chats/filter`,
    {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.user?.accessToken}`,
      },
      credentials: 'include',
      body: JSON.stringify({
        type: 'CHAT',
        message,
      }),
    },
  );

  if (!res.ok && res.error?.message) {
    if (!res.error) {
      throw new Error(FILTER_BAD_WORDS.UNKNOWN_ERROR);
    }

    if (res.error.code === 1102) {
      if (
        res.error.message ===
        FILTER_BAD_WORDS.SERVER_RESPONSE_USER_NOT_PARTICIPATING
      ) {
        throw new Error(FILTER_BAD_WORDS.USER_NOT_PARTICIPATING);
      }
    } else if (res.error.code === 503) {
      throw new Error(NETWORK_ERROR_MESSAGE.OFFLINE);
    }

    throw new Error(FILTER_BAD_WORDS.FAILED_TO_FILTER);
    // return null;
  }

  return res;
};

export default postFilterBadWords;
