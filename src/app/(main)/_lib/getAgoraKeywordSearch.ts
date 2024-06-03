import { Agora } from '@/app/model/Agora';
import { QueryFunction } from '@tanstack/react-query';

type SearchParams = {
  status?: string,
  category?: string,
  q?: string,
};

// eslint-disable-next-line import/prefer-default-export
export const getAgoraKeywordSearch:QueryFunction<
{ agoras: Agora[], nextCursor: number | null },
[_1: string, _2: string, _3: string, searchParams: SearchParams],
{ nextCursor: number | null }> = async ({ queryKey, pageParam = { nextCursor: null } }) => {
  const [, , , { status = 'active', q = '' }] = queryKey;
  const searchParams = { status, agora_name: q };

  const urlSearchParams = new URLSearchParams(searchParams);
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/agoras?${urlSearchParams.toString()}&next=${pageParam.nextCursor ?? ''}`, {
    next: {
      tags: ['agoras', 'search', 'keyword', searchParams.agora_name as string, searchParams.status],
    },
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJpZCI6ImQyZWI4ZTJlLTQwOGYtNGM4YS05NjZiLWE4MGU2YjFkZTE3MyIsInJvbGUiOiJST0xFX1RFTVBfVVNFUiIsImlhdCI6MTcxNjgwNzE3NCwiZXhwIjoxNzE2ODQzMTc0fQ.WC_YzkSzb49QRUIL_g6q8EJ4hiT331LVPNwZuqwvXQs',
    },
    credentials: 'include',
    cache: 'no-cache',
  });

  if (!res.ok) {
    throw new Error('Network response was not ok');
  }

  const result = await res.json();

  return {
    agoras: result.response.agoras,
    nextCursor: result.response.hasNext ? result.response.next : null,
  };
};
