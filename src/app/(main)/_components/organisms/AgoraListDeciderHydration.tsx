import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from '@tanstack/react-query';
import React from 'react';
import { SearchParams } from '@/app/model/Agora';
import {
  getCategoryAgoraListQueryKey,
  getKeywordAgoraListQueryKey,
} from '@/constants/queryKey';
import { getAgoraCategorySearch } from '../../_lib/getAgoraCategorySearch';
import AgoraListDecider from '../molecules/AgoraListDecider';
import { getAgoraKeywordSearch } from '../../_lib/getAgoraKeywordSearch';

type Props = {
  searchParams: SearchParams;
};

export default async function AgoraListDeciderHydration({
  searchParams,
}: Props) {
  const queryClient = new QueryClient();
  const isSearch = searchParams.q;
  await queryClient.prefetchInfiniteQuery({
    queryKey: isSearch
      ? getKeywordAgoraListQueryKey(searchParams)
      : getCategoryAgoraListQueryKey(searchParams),
    queryFn: isSearch ? getAgoraKeywordSearch : getAgoraCategorySearch,
    initialPageParam: { nextCursor: null },
  });
  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <AgoraListDecider searchParams={searchParams} />
    </HydrationBoundary>
  );
}
