import { UnionAgora } from '@/app/model/Agora';
import {
  AGORA_CATEGORY_SEARCH,
  NETWORK_ERROR_MESSAGE,
} from '@/constants/responseErrorMessage';
import { callFetchWrapper } from '@/lib/fetchWrapper';
import { QueryFunction } from '@tanstack/react-query';

type SearchParams = {
  status?: string;
  category?: string;
  q?: string;
};

export const getAgoraCategorySearch: QueryFunction<
  { agoras: UnionAgora[]; nextCursor: number | null },
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

  if (!res.ok && !res.success) {
    if (!res.error) {
      throw new Error(AGORA_CATEGORY_SEARCH.UNKNOWN_ERROR);
    }

    if (res.error.code === 1001) {
      throw new Error(AGORA_CATEGORY_SEARCH.NOT_ALLOWED_STATUS);
    } else if (res.error.code === 1301) {
      throw new Error(AGORA_CATEGORY_SEARCH.NOT_ALLOWED_CATEGORY);
    } else if (res.error.code === -1) {
      throw new Error(res.error.message);
    } else if (res.error.code === 503) {
      throw new Error(NETWORK_ERROR_MESSAGE.OFFLINE);
    }

    throw new Error(AGORA_CATEGORY_SEARCH.FAILED_TO_GET_AGORA_LIST);
    // return {
    //   agoras: [],
    //   nextCursor: null,
    // };
  }

  return {
    agoras: res.response.agoras,
    nextCursor: res.response.hasNext ? res.response.next : null,
  };
};
