'use client';

import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import ErrorFallback from '@/app/_components/templates/ErrorFallback';
import { SearchParams } from '@/app/model/Agora';
import Loading from '@/app/_components/atoms/loading';
import { useSearchStore } from '@/store/search';
import { useShallow } from 'zustand/react/shallow';
import { useKickedStore } from '@/store/kick';
import { swalKickedUserAlert } from '@/utils/swalAlert';
import LivelyAgoraList from './LivelyAgoraList';
import CategoryAgoraNowTitle from '../atoms/CategoryAgoraNowTitle';

const KeywordAgoraList = dynamic(() => import('./KeywordAgoraList'), {
  loading: () => (
    <Loading w="25" h="25" className="m-5 flex justify-center items-center" />
  ),
});

const CategoryAgoraList = dynamic(() => import('./CategoryAgoraList'), {
  loading: () => (
    <Loading w="25" h="25" className="m-5 flex justify-center items-center" />
  ),
});

type Props = {
  searchParams: SearchParams;
};

const errorFallbackProps = {
  headerLabel: '아고라 목록을 불러오던 중 오류가 발생했습니다.',
  btnLabel: '다시 불러오기',
};

function FallbackComponent(props: FallbackProps) {
  return <ErrorFallback {...props} {...errorFallbackProps} />;
}
export default function AgoraListDecider({ searchParams }: Props) {
  const { q } = searchParams;
  const { search, setSearch, tabStatus } = useSearchStore(
    useShallow((state) => ({
      search: state.search,
      setSearch: state.setSearch,
      tabStatus: state.tabStatus,
    })),
  );

  const { kicked, reset } = useKickedStore(
    useShallow((state) => ({
      kicked: state.kicked,
      reset: state.reset,
    })),
  );

  useEffect(() => {
    if (q) {
      setSearch(q);
    }
  }, [q, setSearch]);

  useEffect(() => {
    const handleKicked = async () => {
      if (kicked) {
        const result = await swalKickedUserAlert();

        if (result && result.isConfirmed) {
          reset();
        }
      }
    };

    handleKicked();
  }, [kicked]);

  if (search) {
    return (
      <ErrorBoundary FallbackComponent={FallbackComponent}>
        <KeywordAgoraList searchParams={searchParams} />
      </ErrorBoundary>
    );
  }

  return (
    <>
      {tabStatus === 'active' && (
        <>
          <ErrorBoundary FallbackComponent={FallbackComponent}>
            <LivelyAgoraList />
          </ErrorBoundary>
          <div className="h-6 w-full mb-16">
            <div className="h-full mx-10 bg-gray-400 opacity-15" />
          </div>
        </>
      )}
      <ErrorBoundary FallbackComponent={FallbackComponent}>
        <CategoryAgoraNowTitle searchParams={searchParams} />
        <CategoryAgoraList searchParams={searchParams} />
      </ErrorBoundary>
    </>
  );
}
