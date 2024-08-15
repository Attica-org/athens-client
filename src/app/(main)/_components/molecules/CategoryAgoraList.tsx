'use client';

import React, { useEffect } from 'react';
import {
  InfiniteData,
  useQueryClient,
  useSuspenseInfiniteQuery,
} from '@tanstack/react-query';
import { AgoraData, SearchParams } from '@/app/model/Agora';
import { useInView } from 'react-intersection-observer';
import DeferredComponent from '@/app/_components/utils/DefferedComponent';
import Loading from '@/app/_components/atoms/loading';
import { useCreateAgora } from '@/store/create';
import { useShallow } from 'zustand/react/shallow';
import NoAgoraMessage from '../atoms/NoAgoraMessage';
import { getAgoraCategorySearch } from '../../_lib/getAgoraCategorySearch';
import CategoryAgora from '../atoms/CategoryAgora';

type Props = {
  searchParams: SearchParams;
};

export default function CategoryAgoraList({ searchParams }: Props) {
  const queryClient = useQueryClient();

  const { category: selectedCategory } = useCreateAgora(
    useShallow((state) => ({
      setCategory: state.setCategory,
      category: state.category,
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
    { agoras: AgoraData[]; nextCursor: number | null },
    Object,
    InfiniteData<{ agoras: AgoraData[]; nextCursor: number | null }>,
    [_1: string, _2: string, _3: string, Props['searchParams']],
    { nextCursor: number | null }
  >({
    queryKey: [
      'agoras',
      'search',
      'category',
      { ...searchParams, category: selectedCategory },
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
      return queryClient.getQueryData([
        'agoras',
        'search',
        'category',
        searchParams,
      ]);
    },
  });

  const { ref, inView } = useInView({
    threshold: 0,
    delay: 0,
    rootMargin: '-30px',
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetching) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage, isFetching]);

  useEffect(() => {
    // 초기 데이터 호출 후 카테고리 변경 시 데이터 재호출
    queryClient.invalidateQueries({
      queryKey: [
        'agoras',
        'search',
        'category',
        { ...searchParams, category: selectedCategory },
      ],
    });
  }, [selectedCategory, queryClient]);

  return (
    <>
      {data?.pages[0].agoras.length < 1 ? (
        <NoAgoraMessage />
      ) : (
        <div className="grid under-large:grid-cols-5 gap-x-1rem gap-y-1rem under-mobile:grid-cols-2 mobile:grid-cols-2 foldable:grid-cols-3 tablet:grid-cols-4 under-tablet:grid-cols-4 xl:grid-cols-6 sm:grid-cols-3 lg:grid-cols-5 under-xl:grid-cols-4">
          {data?.pages
            ?.map((page) => page.agoras)
            ?.flat()
            ?.map((agora) => <CategoryAgora key={agora.id} agora={agora} />)}
          <div ref={ref} />
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
    </>
  );
}
