import { Agora } from '@/app/model/Agora';
import { QueryFunction } from '@tanstack/react-query';

type SearchParams = {
  status: string,
  category: string,
};

// eslint-disable-next-line import/prefer-default-export
export const getCategorySearchAgora:QueryFunction<
Agora[],
[_1: string, _2: string, _3: string, searchParams: SearchParams],
Partial<number>> = async ({ queryKey, pageParam = 0 }) => {
  const searchParams = queryKey[3];

  const urlSearchParams = new URLSearchParams(searchParams);
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/agoras?${urlSearchParams.toString()}&cursor=${pageParam}`, {
    next: {
      tags: ['agoras', 'search', 'category', searchParams.category, searchParams.status],
    },
    credentials: 'include',
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Network response was not ok');
  }

  const result = res.json().then((data) => data.response.agoras);
  console.log(result);

  return result;
};
