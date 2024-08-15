'use client';

import React, { useEffect } from 'react';
import {
  InfiniteData,
  useQueryClient,
  useSuspenseInfiniteQuery,
} from '@tanstack/react-query';
import { Agora as IAgora, SearchParams } from '@/app/model/Agora';
import { useInView } from 'react-intersection-observer';
import { useSearchStore } from '@/store/search';
import { useShallow } from 'zustand/react/shallow';
import DeferredComponent from '@/app/_components/utils/DefferedComponent';
import Loading from '@/app/_components/atoms/loading';
import NoAgoraMessage from '../atoms/NoAgoraMessage';
import { getAgoraKeywordSearch } from '../../_lib/getAgoraKeywordSearch';
import KeywordAgora from '../atoms/KeywordAgora';

type Props = {
  searchParams: SearchParams;
};

export default function KeywordAgoraList({ searchParams }: Props) {
  const queryClient = useQueryClient();
  const { search } = useSearchStore(
    useShallow((state) => ({
      search: state.search,
    })),
  );

  const {
    data,
    hasNextPage,
    fetchNextPage,
    isFetching,
    isPending,
    isFetchingNextPage,
  } = useSuspenseInfiniteQuery<
    { agoras: IAgora[]; nextCursor: number | null },
    Object,
    InfiniteData<{ agoras: IAgora[]; nextCursor: number | null }>,
    [_1: string, _2: string, _3: string, Props['searchParams']],
    { nextCursor: number | null }
  >({
    queryKey: ['agoras', 'search', 'keyword', { ...searchParams, q: search }],
    queryFn: getAgoraKeywordSearch,
    staleTime: 60 * 1000,
    gcTime: 500 * 1000,
    initialPageParam: { nextCursor: null },
    getNextPageParam: (lastPage) =>
      lastPage.nextCursor !== null
        ? { nextCursor: lastPage.nextCursor }
        : undefined,
    initialData: () => {
      if (searchParams.q && !search)
        return queryClient.getQueryData([
          'agoras',
          'search',
          'keyword',
          searchParams,
        ]);
      return undefined;
    },
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
        data?.pages
          ?.map((page) => page.agoras)
          ?.flat()
          ?.map((agora) => <KeywordAgora key={agora.id} agora={agora} />)
      )}
      {(isFetching || isPending || isFetchingNextPage) && (
        <DeferredComponent>
          <Loading
            w="32"
            h="32"
            className="m-5 flex justify-center items-center"
          />
        </DeferredComponent>
      )}
      <div ref={ref} />
    </>
  );
}
