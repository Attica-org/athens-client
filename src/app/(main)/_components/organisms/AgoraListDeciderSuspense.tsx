import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from '@tanstack/react-query';
import React from 'react';
import { SearchParams } from '@/app/model/Agora';
import { getAgoraCategorySearch } from '../../_lib/getAgoraCategorySearch';
import AgoraListDecider from '../molecules/AgoraListDecider';

type Props = {
  searchParams: SearchParams;
};

export default async function AgoraListDeciderSuspense({
  searchParams,
}: Props) {
  const queryClient = new QueryClient();
  await queryClient.prefetchInfiniteQuery({
    queryKey: ['agoras', 'search', 'category', searchParams],
    queryFn: getAgoraCategorySearch,
    initialPageParam: { nextCursor: null },
  });
  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <AgoraListDecider searchParams={searchParams} />
    </HydrationBoundary>
  );
}
