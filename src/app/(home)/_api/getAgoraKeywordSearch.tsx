import { Agora } from '@/app/model/Agora';
import { QueryFunction } from '@tanstack/react-query';

type SearchParams = {
  st?: string,
  cat?: string,
  q?: string,
};

// eslint-disable-next-line import/prefer-default-export
export const getAgoraKeywordSearch:QueryFunction<
Agora[],
[_1: string, _2: string, _3: string, searchParams: SearchParams],
Partial<number>> = async ({ queryKey, pageParam = 0 }) => {
  const [, , , { st = 'active', q = '' }] = queryKey;
  const searchParams = { st, q };

  const urlSearchParams = new URLSearchParams(searchParams);
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/agoras?${urlSearchParams.toString()}&cursor=${pageParam}`, {
    next: {
      tags: ['agoras', 'search', 'keyword', searchParams.q as string, searchParams.st],
    },
    credentials: 'include',
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Network response was not ok');
  }

  const result = res.json().then((data) => data.response.agoras);

  return result;
};
