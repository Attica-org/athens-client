import { Agora } from '@/app/model/Agora';
import { callFetchWrapper } from '@/lib/fetchWrapper';
import showToast from '@/utils/showToast';
import { QueryFunction } from '@tanstack/react-query';

type SearchParams = {
  status?: string;
  category?: string;
  q?: string;
};

// eslint-disable-next-line import/prefer-default-export
export const getAgoraKeywordSearch: QueryFunction<
  { agoras: Agora[]; nextCursor: number | null },
  [_1: string, _2: string, _3: string, searchParams: SearchParams],
  { nextCursor: number | null }
> = async ({ queryKey, pageParam = { nextCursor: null } }) => {
  const [, , , { status = 'active', q = '' }] = queryKey;
  const searchParams = { status, agora_name: q };

  const res = await callFetchWrapper(
    `/api/v1/open/agoras?agora-name=${q}&status=${status}&next=${pageParam.nextCursor ?? ''}`,
    {
      next: {
        tags: [
          'agoras',
          'search',
          'keyword',
          searchParams.agora_name as string,
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
