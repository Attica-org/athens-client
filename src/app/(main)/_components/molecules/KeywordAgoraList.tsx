'use client';

import React, { useEffect } from 'react';
import {
  InfiniteData,
  useQueryClient,
  useSuspenseInfiniteQuery,
} from '@tanstack/react-query';
import { SearchParams, UnionAgora } from '@/app/model/Agora';
import { useInView } from 'react-intersection-observer';
import { useSearchStore } from '@/store/search';
import { useShallow } from 'zustand/react/shallow';
import DeferredComponent from '@/app/_components/utils/DefferedComponent';
import Loading from '@/app/_components/atoms/loading';
import { getKeywordAgoraListQueryKey } from '@/constants/queryKey';
import NoAgoraMessage from '../atoms/NoAgoraMessage';
import { getAgoraKeywordSearch } from '../../_lib/getAgoraKeywordSearch';
import KeywordAgora from '../atoms/KeywordAgora';

type Props = {
  searchParams: SearchParams;
};

export default function KeywordAgoraList({ searchParams }: Props) {
  const queryClient = useQueryClient();
  const { search, tabStatus } = useSearchStore(
    useShallow((state) => ({
      search: state.search,
      tabStatus: state.tabStatus,
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
    { agoras: UnionAgora[]; nextCursor: number | null },
    Object,
    InfiniteData<{ agoras: UnionAgora[]; nextCursor: number | null }>,
    [_1: string, _2: string, _3: string, Props['searchParams']],
    { nextCursor: number | null }
  >({
    queryKey: [
      'agoras',
      'search',
      'keyword',
      { ...searchParams, q: search, status: tabStatus },
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
        <div className="pb-3rem w-full">
          {data?.pages
            ?.map((page) => page.agoras)
            ?.flat()
            ?.map((agora) => <KeywordAgora key={agora.id} agora={agora} />)}
        </div>
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
