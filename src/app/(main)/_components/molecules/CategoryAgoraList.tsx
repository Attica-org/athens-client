'use client';

import React, { useCallback, useEffect } from 'react';
import {
  InfiniteData,
  useQueryClient,
  useSuspenseInfiniteQuery,
} from '@tanstack/react-query';
import { AgoraData, SearchParams } from '@/app/model/Agora';
import DeferredComponent from '@/app/_components/utils/DefferedComponent';
import Loading from '@/app/_components/atoms/loading';
import { useCreateAgora } from '@/store/create';
import { useShallow } from 'zustand/react/shallow';
import { VirtuosoGrid } from 'react-virtuoso';
import RefreshIcon from '@/assets/icons/RefreshIcon';
import { useSearchStore } from '@/store/search';
import { getCategoryAgoraListQueryKey } from '@/constants/queryKey';
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

  const loadNextPage = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const renderItemContent = useCallback(
    (index: any, agora: any) => <CategoryAgora agora={agora} key={agora.id} />,
    [],
  );

  useEffect(() => {
    // 초기 데이터 호출 후 카테고리 변경 시 데이터 재호출
    queryClient.invalidateQueries({
      queryKey: [
        'agoras',
        'search',
        'category',
        { ...searchParams, status: tabStatus, category: selectedCategory },
      ],
    });
  }, [selectedCategory, queryClient, tabStatus, searchParams]);

  const handleKeyDownRefresh = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      refetch();
    }
  };

  const handleClickRefresh = () => {
    refetch();
  };

  useEffect(() => {
    if (data.pages.length <= 2) {
      loadNextPage(); // 화면이 큰 경우 초기 데이터 10개로는 스크롤이 생기지 않아 추가 데이터 호출
    }
  }, [data]);

  return (
    <section
      aria-label={
        tabStatus === 'active' ? '활성화 아고라 리스트' : '종료된 아고라 리스트'
      }
      className="w-full h-full"
    >
      {tabStatus === 'active' && (
        <h2
          aria-label="활성화 상태 아고라"
          className="flex justify-between items-center text-md font-semibold dark:text-dark-line-light text-left pl-10 mb-16 w-full"
        >
          NOW
          <button
            type="button"
            aria-label="활성화 아고라 다시 불러오기"
            onClick={handleClickRefresh}
            onKeyDown={handleKeyDownRefresh}
            className="cursor-pointer flex font-normal mr-5"
          >
            <span className="text-xs mr-5 text-athens-sub font-bold">
              새로고침
            </span>
            <RefreshIcon className="w-16 h-16" fill="#FEAC3E" />
          </button>
        </h2>
      )}
      {data?.pages[0].agoras.length < 1 ? (
        <NoAgoraMessage />
      ) : (
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
    </section>
  );
}
