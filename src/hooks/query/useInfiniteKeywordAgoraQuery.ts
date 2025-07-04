import { getAgoraKeywordSearch } from '@/app/(main)/_lib/getAgoraKeywordSearch';
import { AgoraTabStatus, SearchParams, UnionAgora } from '@/app/model/Agora';
import { getKeywordAgoraListQueryKey } from '@/constants/queryKey';
import {
  InfiniteData,
  QueryClient,
  useSuspenseInfiniteQuery,
} from '@tanstack/react-query';

type InfiniteKeywordAgoraQueryArg = {
  searchParams: SearchParams;
  search: string;
  status: AgoraTabStatus;
  queryClient: QueryClient;
};

export const useInfiniteKeywordAgoraQuery = ({
  searchParams,
  search,
  status,
  queryClient,
}: InfiniteKeywordAgoraQueryArg) => {
  return useSuspenseInfiniteQuery<
    { agoras: UnionAgora[]; nextCursor: number | null },
    Object,
    InfiniteData<{ agoras: UnionAgora[]; nextCursor: number | null }>,
    [_1: string, _2: string, _3: string, SearchParams],
    { nextCursor: number | null }
  >({
    queryKey: [
      'agoras',
      'search',
      'keyword',
      { ...searchParams, q: search, status },
    ],
    queryFn: getAgoraKeywordSearch,
    staleTime: 60 * 1000,
    gcTime: 500 * 1000,
    initialPageParam: { nextCursor: null },
    getNextPageParam: (lastPage) =>
      lastPage.nextCursor !== null
        ? { nextCursor: lastPage.nextCursor }
        : undefined,
    initialData: () => {
      if (searchParams.q && !search) {
        return queryClient.getQueryData(
          getKeywordAgoraListQueryKey(searchParams),
        );
      }
      return undefined;
    },
  });
};
