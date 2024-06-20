'use client';

import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import React from 'react';
import { getAgoraCategorySearch } from '../../_lib/getAgoraCategorySearch';
import SearchDecider from '../molecules/SearchDecider';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorFallback from '@/app/_components/templates/ErrorFallback';

type Props = {
  searchParams: { status?: string, category?: string, q?: string },
};


const errorFallbackProps = {
  headerLabel: '아고라 목록을 불러오던 중 오류가 발생했습니다.',
  btnLabel: '다시 불러오기',
}

export default async function SearchDeciderSuspense({ searchParams }: Props) {
  const queryClient = new QueryClient();
  await queryClient.prefetchInfiniteQuery({
    queryKey: ['agoras', 'search', 'category', searchParams],
    queryFn: getAgoraCategorySearch,
    initialPageParam: { nextCursor: null },
  });
  const dehydratedState = dehydrate(queryClient);

  
  return (
    <ErrorBoundary FallbackComponent={(props) => <ErrorFallback {...props} {...errorFallbackProps}/>}>
      <HydrationBoundary state={dehydratedState}>
        <SearchDecider searchParams={searchParams} />
      </HydrationBoundary>
    </ErrorBoundary>
  );
}
