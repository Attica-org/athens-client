import { getAgoraCategorySearch } from '@/app/(main)/_lib/getAgoraCategorySearch';
import { AgoraTabStatus, SearchParams, UnionAgora } from '@/app/model/Agora';
import { AGORACATEGORY } from '@/constants/consts';
import { getCategoryAgoraListQueryKey } from '@/constants/queryKey';
import {
  InfiniteData,
  QueryClient,
  useSuspenseInfiniteQuery,
} from '@tanstack/react-query';

type InfiniteAgoraQueryArg = {
  searchParams: SearchParams;
  category: keyof typeof AGORACATEGORY;
  status: AgoraTabStatus;
  queryClient: QueryClient;
};

export const useInfiniteAgoraQuery = ({
  searchParams,
  category,
  status,
  queryClient,
}: InfiniteAgoraQueryArg) => {
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
      'category',
      { ...searchParams, status, category },
    ],
    queryFn: getAgoraCategorySearch,
    staleTime: 60 * 1000,
    gcTime: 500 * 1000,
    initialPageParam: { nextCursor: null },
    getNextPageParam: (lastPage) =>
      lastPage.nextCursor !== null
        ? { nextCursor: lastPage.nextCursor }
        : undefined,
    initialData: () => {
      return queryClient.getQueryData(
        getCategoryAgoraListQueryKey(searchParams),
      );
    },
  });
};
