import { AgoraId } from '@/app/model/Agora';
import { BadWordsFilterResponse, Message } from '@/app/model/Message';
import { AUTH_MESSAGE, SIGNIN_REQUIRED } from '@/constants/authErrorMessage';
import {
  FILTER_BAD_WORDS,
  NETWORK_ERROR_MESSAGE,
} from '@/constants/responseErrorMessage';
import { callFetchWrapper } from '@/lib/fetchWrapper';
import { getSession } from '@/serverActions/auth';
import isNull from '@/utils/validation/validateIsNull';

type PostFilterBadWordsArg = {
  message: Message['content'];
  agoraId: AgoraId;
};

const postFilterBadWords = async ({
  message,
  agoraId,
}: PostFilterBadWordsArg) => {
  const session = await getSession();
  if (isNull(session)) {
    throw new Error(SIGNIN_REQUIRED);
  }

  const res = await callFetchWrapper<BadWordsFilterResponse>(
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

    const errorMessage =
      typeof res.error.message === 'string' ? res.error.message : 'ERROR';

    if (res.error.code === 1102) {
      if (
        errorMessage === FILTER_BAD_WORDS.SERVER_RESPONSE_USER_NOT_PARTICIPATING
      ) {
        throw new Error(FILTER_BAD_WORDS.USER_NOT_PARTICIPATING);
      }
    } else if (res.error.code === 503) {
      throw new Error(NETWORK_ERROR_MESSAGE.OFFLINE);
    } else if (AUTH_MESSAGE.includes(errorMessage)) {
      throw new Error(errorMessage);
    }

    throw new Error(FILTER_BAD_WORDS.FAILED_TO_FILTER);
    // return null;
  }

  if (isNull(res.response)) {
    throw new Error(FILTER_BAD_WORDS.UNKNOWN_ERROR);
  }

  const result = res.response;
  return result;
};

export default postFilterBadWords;
