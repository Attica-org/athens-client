'use client';

import React, { useEffect } from 'react';
import { InfiniteData, useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { AgoraData } from '@/app/model/Agora';
import { useInView } from 'react-intersection-observer';
import Agora from '../atoms/Agora';
import { getAgoraCategorySearch } from '../../_lib/getAgoraCategorySearch';
import NoAgoraMessage from '../atoms/NoAgoraMessage';

type Props = {
  searchParams: { status?: string; category?: string; q?: string };
};

export default function AgoraList({ searchParams }: Props) {
  const { data, hasNextPage, fetchNextPage, isFetching } =
    useSuspenseInfiniteQuery<
      { agoras: AgoraData[]; nextCursor: number | null },
      Object,
      InfiniteData<{ agoras: AgoraData[]; nextCursor: number | null }>,
      [_1: string, _2: string, _3: string, Props['searchParams']],
      { nextCursor: number | null }
    >({
      queryKey: ['agoras', 'search', 'category', searchParams],
      queryFn: getAgoraCategorySearch,
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
        <div className="grid under-large:grid-cols-5 gap-x-1rem gap-y-1rem under-mobile:grid-cols-2 mobile:grid-cols-2 foldable:grid-cols-3 tablet:grid-cols-4 under-tablet:grid-cols-4 xl:grid-cols-6 sm:grid-cols-3 lg:grid-cols-5 under-xl:grid-cols-4">
          {data?.pages.map((page) => (
            <React.Fragment key={page.agoras[0]?.id}>
              {page.agoras.map((agora) => (
                <Agora key={agora.id} agora={agora} />
              ))}
            </React.Fragment>
          ))}
        </div>
      )}
      <div ref={ref} />
    </>
  );
}
