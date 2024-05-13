import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import React from 'react';
import { getAgoraCategorySearch } from '../../_api/getAgoraCategorySearch';
import SearchDecider from '../molecules/SearchDecider';

type Props = {
  searchParams: { st?: string, cat?: string, q?: string },
};

export default async function SearchDeciderSuspense({ searchParams }: Props) {
  const queryClient = new QueryClient();
  await queryClient.prefetchInfiniteQuery({
    queryKey: ['agoras', 'search', 'category', searchParams],
    queryFn: getAgoraCategorySearch,
    initialPageParam: 0,
  });
  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <SearchDecider searchParams={searchParams} />
    </HydrationBoundary>
  );
}
