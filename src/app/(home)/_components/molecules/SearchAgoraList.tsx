'use client';

import React, { useEffect } from 'react';
import { InfiniteData, useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { Agora as IAgora } from '@/app/model/Agora';
import { useInView } from 'react-intersection-observer';
import SearchAgora from '../atoms/SearchAgora';
import { getAgoraKeywordSearch } from '../../_api/getAgoraKeywordSearch';

type Props = {
  searchParams: { st?: string, cat?: string, q?: string }
};

export default function SearchAgoraList({ searchParams }: Props) {
  const {
    data, hasNextPage, fetchNextPage, isFetching,
  } = useSuspenseInfiniteQuery<IAgora[], Object, InfiniteData<IAgora[]>, [_1: string, _2: string, _3:string, Props['searchParams']], number>({
    queryKey: ['agoras', 'search', 'keyword', searchParams],
    queryFn: getAgoraKeywordSearch,
    staleTime: 60 * 1000,
    gcTime: 500 * 1000,
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.at(-1)?.id,
  });

  const { ref, inView } = useInView({
    threshold: 0,
    delay: 0,
    rootMargin: '-80px',
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetching) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage, isFetching]);

  return (
    <>
      {data?.pages.map((page) => (
        <React.Fragment key={page[0].id}>
          {page.map((agora) => (
            <SearchAgora key={agora.id} agora={agora} />
          ))}
        </React.Fragment>
      ))}
      <div ref={ref} className="h-50 bg-red-400 w-full" />
    </>
  );
}
