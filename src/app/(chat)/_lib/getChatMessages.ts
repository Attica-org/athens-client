import { getChatMessagesQueryKey as getChatMessagesTags } from '@/constants/queryKey';
import { callFetchWrapper } from '@/lib/fetchWrapper';
import { SIGNIN_REQUIRED } from '@/constants/authErrorMessage';
import {
  CHAT_MESSAGE,
  NETWORK_ERROR_MESSAGE,
} from '@/constants/responseErrorMessage';
import isNull from '@/utils/validation/validateIsNull';

type Search = {
  size: string;
  key?: string;
};

export const getChatMessages = (session: any) => {
  return async ({ queryKey, pageParam }: any) => {
    const [, agoraId] = queryKey;

    if (isNull(session)) {
      throw new Error(SIGNIN_REQUIRED);
    }

    const searchParams: Search = {
      size: pageParam.meta.effectiveSize.toString(),
    };

    if (pageParam.meta.key !== null) {
      searchParams.key = pageParam.meta.key.toString();
    }

    const urlSearchParams = new URLSearchParams(Object.entries(searchParams));

    const res = await callFetchWrapper(
      `/api/v1/open/agoras/${agoraId}/chats?${urlSearchParams.toString()}`,
      {
        next: {
          tags: getChatMessagesTags(Number(agoraId)),
        },
        credentials: 'include',
        cache: 'no-cache',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.user?.accessToken}`,
        },
      },
    );

    if (!res.ok && !res.success) {
      if (!res.error) {
        throw new Error(CHAT_MESSAGE.UNKNOWN_ERROR);
      }

      if (res.error.code === 1301) {
        throw new Error(CHAT_MESSAGE.NOT_FOUND_AGORA);
      } else if (res.error.code === -1) {
        throw new Error(res.error.message);
      } else if (res.error.code === 503) {
        throw new Error(NETWORK_ERROR_MESSAGE.OFFLINE);
      }

      throw new Error(CHAT_MESSAGE.FAILED_TO_GET_CHAT);
    }

    const result = res.response;

    return {
      chats: result.chats.reverse(),
      meta: result.meta,
    };
  };
};
