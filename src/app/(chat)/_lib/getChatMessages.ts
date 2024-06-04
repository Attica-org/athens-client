import { Message } from '@/app/model/Message';
import fetchWrapper from '@/lib/fetchWrapper';
import { getToken } from '@/lib/getToken';
import tokenManager from '@/utils/tokenManager';
import { QueryFunction } from '@tanstack/react-query';

type Meta = {
  key: number | null;
  size: number;
};

// eslint-disable-next-line import/prefer-default-export
export const getChatMessages:QueryFunction<
{ chats: Message[], meta: Meta },
[_1: string, _2: string, _3: string],
{ meta: Meta }> = async ({ queryKey, pageParam }) => {
  const [, agoraId] = queryKey;
  const searchParams = {
    size: pageParam.meta.size.toString(),
    key: pageParam.meta.key ? pageParam.meta.key.toString() : '',
  };
  const urlSearchParams = new URLSearchParams(Object.entries(searchParams));

  // 토큰을 가지고 있는지 확인
  if (tokenManager.getToken() === undefined) {
    await getToken();
  }

  const res = await fetchWrapper.call(`/api/v1/auth/agoras/${agoraId}/chats?${urlSearchParams.toString()}`, {
    method: 'GET',
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
    console.log(res.error.message);
    throw new Error('Network response was not ok');
  }

  const result = res.response;

  return {
    chats: result.chats,
    meta: result.meta,
  };
};
