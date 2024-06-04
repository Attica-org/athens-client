import { Agora } from '@/app/model/Agora';
import fetchWrapper from '@/lib/fetchWrapper';
import errorMessage from '@/utils/errorMessage';
import { QueryFunction } from '@tanstack/react-query';
import { redirect } from 'next/navigation';

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

  const res = await fetchWrapper.call(`/api/v1/open/agoras?${urlSearchParams.toString()}&next=${pageParam.nextCursor ?? ''}`, {
    next: {
      tags: ['agoras', 'search', 'category', searchParams.category, searchParams.status],
    },
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    cache: 'no-cache',
  });

  if (res.success === false) {
    if (res.error.code === 1001) {
      errorMessage.setMessage('허용되지 않는 status 입니다.');
    }
    if (res.error.code === 1301) {
      errorMessage.setMessage('허용되지 않는 카테고리입니다.');
    }
    redirect('/home?status=active');
  }

  const result = res.response;

  return {
    agoras: result.agoras,
    nextCursor: result.hasNext ? result.next : null,
  };
};
