import { Message } from '@/app/model/Message';
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

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/agoras/${agoraId}/chats?${urlSearchParams.toString()}`, {
    method: 'GET',
    next: {
      tags: ['chat', agoraId, 'messages'],
    },
    credentials: 'include',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJpZCI6ImQyZWI4ZTJlLTQwOGYtNGM4YS05NjZiLWE4MGU2YjFkZTE3MyIsInJvbGUiOiJST0xFX1RFTVBfVVNFUiIsImlhdCI6MTcxNjgwNzE3NCwiZXhwIjoxNzE2ODQzMTc0fQ.WC_YzkSzb49QRUIL_g6q8EJ4hiT331LVPNwZuqwvXQs',
    },
  });

  if (!res.ok) {
    throw new Error('Network response was not ok');
  }

  const result = await res.json();

  console.log('result', result);
  return {
    chats: result.response.chats,
    meta: result.response.meta,
  };
};
