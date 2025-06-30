'use client';

import React, { useCallback, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { AgoraTabStatus, SearchParams } from '@/app/model/Agora';
import DeferredComponent from '@/app/_components/utils/DefferedComponent';
import Loading from '@/app/_components/atoms/loading';
import { useCreateAgora } from '@/store/create';
import { useShallow } from 'zustand/react/shallow';
import { VirtuosoGrid } from 'react-virtuoso';
import { useSearchStore } from '@/store/search';
import { useInfiniteAgoraQuery } from '@/hooks/query/useInfiniteAgoraQuery';
import { useCategoryAgoraRefetch } from '@/hooks/useCategoryAgoraRefetch';
import NoAgoraMessage from '../atoms/NoAgoraMessage';
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
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    isFetching,
    isPending,
  } = useInfiniteAgoraQuery({
    searchParams,
    category: selectedCategory,
    status: tabStatus,
    queryClient,
  });

  const loadNextPage = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const { refetchAgoraList } = useCategoryAgoraRefetch(queryClient);

  useEffect(() => {
    // 초기 데이터 호출 후 카테고리 변경 시 데이터 재호출
    if (!isPending && !isFetching && isFetchingNextPage) {
      refetchAgoraList({
        searchParams,
        category: selectedCategory,
        status: tabStatus,
      });
    }
  }, [selectedCategory, tabStatus]);

  useEffect(() => {
    if (data.pages.length <= 2) {
      loadNextPage(); // 화면이 큰 경우 초기 데이터 10개로는 스크롤이 생기지 않아 추가 데이터 호출
    }
  }, [data, loadNextPage]);

  const renderItemContent = useCallback(
    (index: any, agora: any) => <CategoryAgora agora={agora} key={agora.id} />,
    [],
  );

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
        tabStatus === AgoraTabStatus.ACTIVE
          ? '활성화 아고라 리스트'
          : '종료된 아고라 리스트'
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
