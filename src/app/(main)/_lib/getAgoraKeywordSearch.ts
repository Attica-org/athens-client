import { Agora } from '@/app/model/Agora';
import { AGORA_KEYWORD_SEARCH } from '@/constants/responseErrorMessage';
import { callFetchWrapper } from '@/lib/fetchWrapper';
import { QueryFunction } from '@tanstack/react-query';

type SearchParams = {
  status?: string;
  category?: string;
  q?: string;
};

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

  if (!res.ok && !res.success) {
    if (!res.error) {
      throw new Error(AGORA_KEYWORD_SEARCH.UNKNOWN_ERROR);
    }

    if (res.error.code === 1001) {
      throw new Error(AGORA_KEYWORD_SEARCH.NOT_ALLOWED_STATUS);
    }
    if (res.error.code === -1) {
      throw new Error(res.error.message);
    }

    throw new Error(AGORA_KEYWORD_SEARCH.FAILED_TO_GET_AGORA_LIST);
    // return {
    //   agoras: [],
    //   nextCursor: null,
    // };
  }
  //
  const result = res.response;

  return {
    agoras: result.agoras,
    nextCursor: result.hasNext ? result.next : null,
  };
};
