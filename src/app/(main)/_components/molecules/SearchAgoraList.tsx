'use client';

import React, { useEffect } from 'react';
import { InfiniteData, useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { Agora as IAgora } from '@/app/model/Agora';
import { useInView } from 'react-intersection-observer';
import SearchAgora from '../atoms/SearchAgora';
import { getAgoraKeywordSearch } from '../../_lib/getAgoraKeywordSearch';
import NoAgoraMessage from '../atoms/NoAgoraMessage';

type Props = {
  searchParams: { status?: string; category?: string; q?: string };
};

export default function SearchAgoraList({ searchParams }: Props) {
  const { data, hasNextPage, fetchNextPage, isFetching } =
    useSuspenseInfiniteQuery<
      { agoras: IAgora[]; nextCursor: number | null },
      Object,
      InfiniteData<{ agoras: IAgora[]; nextCursor: number | null }>,
      [_1: string, _2: string, _3: string, Props['searchParams']],
      { nextCursor: number | null }
    >({
      queryKey: ['agoras', 'search', 'keyword', searchParams],
      queryFn: getAgoraKeywordSearch,
      staleTime: 60 * 1000,
      gcTime: 500 * 1000,
      initialPageParam: { nextCursor: null },
      getNextPageParam: (lastPage) =>
        lastPage.nextCursor !== null
          ? { nextCursor: lastPage.nextCursor }
          : undefined,
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
      {data?.pages[0].agoras.length < 1 ? (
        <NoAgoraMessage />
      ) : (
        data?.pages.map((page) => (
          <React.Fragment key={page.agoras[0]?.id || 0}>
            {page.agoras.map((agora) => (
              <SearchAgora key={agora.id} agora={agora} />
            ))}
          </React.Fragment>
        ))
      )}
      <div ref={ref} />
    </>
  );
}
