import {
  AgoraSearchResponse,
  AgoraTabStatus,
  CategoryAgora,
  UnionAgora,
} from '@/app/model/Agora';
import {
  AGORA_CATEGORY_SEARCH,
  NETWORK_ERROR_MESSAGE,
} from '@/constants/responseErrorMessage';
import { callFetchWrapper } from '@/lib/fetchWrapper';
import isNull from '@/utils/validation/validateIsNull';
import { QueryFunction } from '@tanstack/react-query';

type SearchParams = {
  status?: string;
  category?: string;
  q?: string;
};

interface CategoryAgoraList extends AgoraSearchResponse {
  agoras: CategoryAgora[];
}

export const getAgoraCategorySearch: QueryFunction<
  { agoras: UnionAgora[]; nextCursor: number | null },
  [_1: string, _2: string, _3: string, searchParams: SearchParams],
  { nextCursor: number | null }
> = async ({ queryKey, pageParam = { nextCursor: null } }) => {
  const [, , , { status = AgoraTabStatus.ACTIVE, category = '1' }] = queryKey;
  const searchParams = { status, category };

  const urlSearchParams = new URLSearchParams(searchParams);

  const res = await callFetchWrapper<CategoryAgoraList>(
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

    const errorMessage =
      typeof res.error.message === 'string' ? res.error.message : 'ERROR';

    if (res.error.code === 1001) {
      throw new Error(AGORA_CATEGORY_SEARCH.NOT_ALLOWED_STATUS);
    } else if (res.error.code === 1301) {
      throw new Error(AGORA_CATEGORY_SEARCH.NOT_ALLOWED_CATEGORY);
    } else if (res.error.code === -1) {
      throw new Error(errorMessage);
    } else if (res.error.code === 503) {
      throw new Error(NETWORK_ERROR_MESSAGE.OFFLINE);
    }

    throw new Error(AGORA_CATEGORY_SEARCH.FAILED_TO_GET_AGORA_LIST);
  }

  if (isNull(res.response)) {
    throw new Error(AGORA_CATEGORY_SEARCH.UNKNOWN_ERROR);
  }

  const result = res.response;

  return {
    agoras: result.agoras,
    nextCursor: result?.hasNext ? result.next : null,
  };
};
