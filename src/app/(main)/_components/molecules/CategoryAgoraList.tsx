'use client';

import React, { useCallback, useEffect } from 'react';
import {
  InfiniteData,
  useQueryClient,
  useSuspenseInfiniteQuery,
} from '@tanstack/react-query';
import { SearchParams, UnionAgora } from '@/app/model/Agora';
import DeferredComponent from '@/app/_components/utils/DefferedComponent';
import Loading from '@/app/_components/atoms/loading';
import { useCreateAgora } from '@/store/create';
import { useShallow } from 'zustand/react/shallow';
import { VirtuosoGrid } from 'react-virtuoso';
import { useSearchStore } from '@/store/search';
import {
  getCategoryAgoraListBasicQueryKey,
  getCategoryAgoraListQueryKey,
} from '@/constants/queryKey';
import NoAgoraMessage from '../atoms/NoAgoraMessage';
import { getAgoraCategorySearch } from '../../_lib/getAgoraCategorySearch';
import CategoryAgora from '../atoms/CategoryAgora';
import CustomList from '../atoms/VirtuosoGridCustomList';

type Props = {
  searchParams: SearchParams;
};

const virtuosoGridComponents = {
  List: CustomList,
};

export default function CategoryAgoraList({ searchParams }: Props) {
  const queryClient = useQueryClient();

  const { category: selectedCategory } = useCreateAgora(
    useShallow((state) => ({
      setCategory: state.setCategory,
      category: state.category,
    })),
  );

  const { tabStatus } = useSearchStore(
    useShallow((state) => ({
      tabStatus: state.tabStatus,
    })),
  );

  const {
    data,
    refetch,
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
      'category',
      { ...searchParams, status: tabStatus, category: selectedCategory },
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
      return queryClient.getQueryData(
        getCategoryAgoraListQueryKey(searchParams),
      );
    },
  });

  const loadNextPage = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const renderItemContent = useCallback(
    (index: any, agora: any) => <CategoryAgora agora={agora} key={agora.id} />,
    [],
  );

  useEffect(() => {
    const refetchAgoraList = async () => {
      await queryClient.resetQueries({
        queryKey: getCategoryAgoraListBasicQueryKey(),
      });

      await queryClient.invalidateQueries({
        queryKey: [
          'agoras',
          'search',
          'category',
          { ...searchParams, status: tabStatus, category: selectedCategory },
        ],
      });
    };
    // 초기 데이터 호출 후 카테고리 변경 시 데이터 재호출
    refetchAgoraList();
  }, [selectedCategory, queryClient, tabStatus, searchParams, refetch]);

  useEffect(() => {
    if (data.pages.length <= 2) {
      loadNextPage(); // 화면이 큰 경우 초기 데이터 10개로는 스크롤이 생기지 않아 추가 데이터 호출
    }
  }, [data, loadNextPage]);

  const Content = useCallback(() => {
    if (data?.pages[0].agoras.length < 1) {
      return <NoAgoraMessage />;
    }

    return (
      <VirtuosoGrid
        useWindowScroll={false}
        className="w-full h-full scrollbar-hide"
        data={data.pages.flatMap((page) => page.agoras)}
        totalCount={data.pages[0].agoras.length}
        overscan={2}
        components={virtuosoGridComponents}
        itemContent={renderItemContent}
        endReached={() => loadNextPage()}
      />
    );
  }, [data, loadNextPage, renderItemContent]);

  return (
    <section
      aria-label={
        tabStatus === 'active' ? '활성화 아고라 리스트' : '종료된 아고라 리스트'
      }
      className="w-full h-full"
    >
      {Content()}
      {(isFetching || isPending || isFetchingNextPage) && (
        <DeferredComponent>
          <Loading
            w="25"
            h="25"
            className="m-5 flex justify-center items-center"
          />
        </DeferredComponent>
      )}
    </section>
  );
}
