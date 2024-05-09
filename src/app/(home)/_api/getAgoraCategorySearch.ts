import { Agora } from '@/app/model/Agora';
import { QueryFunction } from '@tanstack/react-query';

type SearchParams = {
  st?: string,
  cat?: string,
  q?: string,
};

// eslint-disable-next-line import/prefer-default-export
export const getAgoraCategorySearch:QueryFunction<
Agora[],
[_1: string, _2: string, _3: string, searchParams: SearchParams],
Partial<number>> = async ({ queryKey, pageParam = 0 }) => {
  const [, , , { st = 'active', cat = '전체' }] = queryKey;
  const searchParams = { st, cat };

  const urlSearchParams = new URLSearchParams(searchParams);

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/agoras?${urlSearchParams.toString()}&cursor=${pageParam}`, {
    next: {
      tags: ['agoras', 'search', 'category', searchParams.cat, searchParams.st],
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
