import { Message } from '@/app/model/Message';
import fetchWrapper from '@/lib/fetchWrapper';
import { getToken } from '@/lib/getToken';
import showToast from '@/utils/showToast';
import tokenManager from '@/utils/tokenManager';
import { QueryFunction } from '@tanstack/react-query';

type Meta = {
  key: number | null;
  effectiveSize: number;
};

type Search = {
  size: string;
  key?: string;
};

// eslint-disable-next-line import/prefer-default-export
export const getChatMessages:QueryFunction<
{ chats: Message[], meta: Meta },
[_1: string, _2: string, _3: string],
{ meta: Meta }> = async ({ queryKey, pageParam }) => {
  const [, agoraId] = queryKey;
  const searchParams:Search = {
    size: pageParam.meta.effectiveSize.toString(),
  };

  if (pageParam.meta.key !== null) {
    searchParams.key = pageParam.meta.key.toString();
  }
  const urlSearchParams = new URLSearchParams(Object.entries(searchParams));

  // 토큰을 가지고 있는지 확인
  if (tokenManager.getToken() === undefined) {
    await getToken();
  }

  const res = await fetchWrapper.call(`/api/v1/open/agoras/${agoraId}/chats?${urlSearchParams.toString()}`, {
    next: {
      tags: ['chat', agoraId, 'messages'],
    },
    credentials: 'include',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${tokenManager.getToken()}`,
    },
  });

  if (res.success === false) {
    if (res.error.code === 1301) {
      showToast('해당 아고라를 찾을 수 없습니다.', 'error');
    } else {
      showToast('채팅 내역을 불러올 수 없습니다.', 'error');
    }

    return {
      chats: [],
      meta: {
        key: -1,
        effectiveSize: 0,
      },
    };
  }

  const result = res.response;

  return {
    chats: result.chats,
    meta: result.meta,
  };
};
