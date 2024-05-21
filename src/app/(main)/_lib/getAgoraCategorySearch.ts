import { Agora } from '@/app/model/Agora';
import { QueryFunction } from '@tanstack/react-query';

type SearchParams = {
  status?: string,
  category?: string,
  q?: string,
};

// eslint-disable-next-line import/prefer-default-export
export const getAgoraCategorySearch:QueryFunction<
{ agoras: Agora[], nextCursor: number | null },
[_1: string, _2: string, _3: string, searchParams: SearchParams],
{ nextCursor: number | null }> = async ({ queryKey, pageParam = { nextCursor: null } }) => {
  const [, , , { status = 'active', category = '1' }] = queryKey;
  const searchParams = { status, category };

  const urlSearchParams = new URLSearchParams(searchParams);

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/agoras?${urlSearchParams.toString()}&next=${pageParam.nextCursor ?? ''}`, {
    next: {
      tags: ['agoras', 'search', 'category', searchParams.category, searchParams.status],
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
