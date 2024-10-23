import { AgoraData } from '@/app/model/Agora';
import { callFetchWrapper } from '@/lib/fetchWrapper';
import showToast from '@/utils/showToast';
import { QueryFunction } from '@tanstack/react-query';

type SearchParams = {
  status?: string;
  category?: string;
  q?: string;
};

// eslint-disable-next-line import/prefer-default-export
export const getAgoraCategorySearch: QueryFunction<
  { agoras: AgoraData[]; nextCursor: number | null },
  [_1: string, _2: string, _3: string, searchParams: SearchParams],
  { nextCursor: number | null }
> = async ({ queryKey, pageParam = { nextCursor: null } }) => {
  const [, , , { status = 'active', category = '1' }] = queryKey;
  const searchParams = { status, category };

  const urlSearchParams = new URLSearchParams(searchParams);

  const res = await callFetchWrapper(
    `/api/v1/open/agoras?${urlSearchParams.toString()}&next=${pageParam.nextCursor ?? ''}`,
    {
      next: {
        tags: [
          'agoras',
          'search',
          'category',
          searchParams.category,
          searchParams.status,
        ],
      },
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      cache: 'no-cache',
    },
  );

  if (res.success === false) {
    if (res.error.code === 1001) {
      showToast('허용되지 않는 status 입니다.', 'error');
    }
    if (res.error.code === 1301) {
      showToast('허용되지 않는 카테고리입니다.', 'error');
    }
    if (res.error.code === -1) {
      throw new Error(res.error.message);
    }
    // redirect('/home?status=active');
    return {
      agoras: [],
      nextCursor: null,
    };
  }

  const result = res.response;

  return {
    agoras: result.agoras,
    nextCursor: result.hasNext ? result.next : null,
  };
};
