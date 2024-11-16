import { SIGNIN_REQUIRED } from '@/constants/authErrorMessage';
import { AGORA_EXIT } from '@/constants/responseErrorMessage';
import { callFetchWrapper } from '@/lib/fetchWrapper';
import { getSession } from '@/serverActions/auth';

type Props = {
  agoraId: number;
};

const patchChatExit = async ({ agoraId }: Props) => {
  const session = await getSession();
  if (!session) {
    throw new Error(SIGNIN_REQUIRED);
  }

  const res = await callFetchWrapper(`/api/v1/auth/agoras/${agoraId}/exit`, {
    method: 'PATCH',
    next: {
      tags: [],
    },
    credentials: 'include',
    cache: 'no-cache',
    headers: {
      Authorization: `Bearer ${session.user?.accessToken}`,
    },
  });

  console.log('res', res);
  if (!res.ok && !res.success) {
    console.log('res.error', res.error);
    if (!res.error) {
      throw new Error(AGORA_EXIT.UNKNOWN_ERROR);
    }

    if (res.error.code === 1301) {
      if (
        res.error.message.startsWith(AGORA_EXIT.SERVER_RESPONSE_NOT_FOUND_AGORA)
      ) {
        throw new Error(AGORA_EXIT.NOT_FOUND_AGORA);
      } else if (
        res.error.message.startsWith(AGORA_EXIT.SERVER_RESPONSE_NOT_FOUND_USER)
      ) {
        throw new Error(AGORA_EXIT.NOT_FOUND_USER);
      }
    }

    throw new Error(AGORA_EXIT.FAILED_TO_EXIT);
    // return null;
  }

  const result = res.response;

  return result;
};

export default patchChatExit;
