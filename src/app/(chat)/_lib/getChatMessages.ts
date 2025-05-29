import { getChatMessagesQueryKey as getChatMessagesTags } from '@/constants/queryKey';
import { callFetchWrapper } from '@/lib/fetchWrapper';
import { AUTH_MESSAGE, SIGNIN_REQUIRED } from '@/constants/authErrorMessage';
import {
  CHAT_MESSAGE,
  NETWORK_ERROR_MESSAGE,
} from '@/constants/responseErrorMessage';
import isNull from '@/utils/validation/validateIsNull';
import {
  Message,
  MessageMetaResponse,
  MessagePageParams,
} from '@/app/model/Message';

type MessageResponse = {
  chats: Message[];
  meta: MessageMetaResponse;
};

export const getChatMessages = (
  session: any,
): (({
  queryKey,
  pageParam,
}: {
  queryKey: [string, string, string];
  pageParam: {
    meta: MessageMetaResponse;
  };
}) => Promise<{
  chats: Message[];
  meta: MessageMetaResponse;
}>) => {
  return async ({ queryKey, pageParam }: any) => {
    const [, agoraId] = queryKey;

    if (isNull(session)) {
      throw new Error(SIGNIN_REQUIRED);
    }

    const searchParams: MessagePageParams = {
      size: pageParam.meta.effectiveSize.toString(),
    };

    if (pageParam.meta.key !== null) {
      searchParams.key = pageParam.meta.key.toString();
    }

    const urlSearchParams = new URLSearchParams(Object.entries(searchParams));

    const res = await callFetchWrapper<MessageResponse>(
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

      const errorMessage =
        typeof res.error.message === 'string' ? res.error.message : 'ERROR';

      if (res.error.code === 1301) {
        throw new Error(CHAT_MESSAGE.NOT_FOUND_AGORA);
      } else if (res.error.code === -1) {
        throw new Error(errorMessage);
      } else if (res.error.code === 503) {
        throw new Error(NETWORK_ERROR_MESSAGE.OFFLINE);
      } else if (AUTH_MESSAGE.includes(errorMessage)) {
        throw new Error(errorMessage);
      }

      throw new Error(CHAT_MESSAGE.FAILED_TO_GET_CHAT);
    }

    if (isNull(res.response)) {
      throw new Error(CHAT_MESSAGE.UNKNOWN_ERROR);
    }

    const result = res.response;

    return {
      chats: result.chats,
      meta: result.meta,
    };
  };
};
