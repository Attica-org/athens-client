'use client';

import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import ErrorFallback from '@/app/_components/templates/ErrorFallback';
import Loading from '../atoms/loading';

const SearchAgoraList = dynamic(() => import('./SearchAgoraList'), {
  loading: () => <Loading w="25" h="25" />,
  ssr: false,
});

const AgoraList = dynamic(() => import('./AgoraList'), {
  loading: () => <Loading w="25" h="25" />,
  ssr: false,
});

type Props = {
  searchParams: { status?: string; category?: string; q?: string };
};

const errorFallbackProps = {
  headerLabel: '아고라 목록을 불러오던 중 오류가 발생했습니다.',
  btnLabel: '다시 불러오기',
};

function FallbackComponent(props: FallbackProps) {
  return <ErrorFallback {...props} {...errorFallbackProps} />;
}
export default function SearchDecider({ searchParams }: Props) {
  const { q } = searchParams;

  if (q) {
    return (
      <ErrorBoundary FallbackComponent={FallbackComponent}>
        <Suspense fallback={<Loading w="25" h="25" />}>
          <SearchAgoraList searchParams={searchParams} />
        </Suspense>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary FallbackComponent={FallbackComponent}>
      <Suspense fallback={<Loading w="25" h="25" />}>
        <AgoraList searchParams={searchParams} />
      </Suspense>
    </ErrorBoundary>
  );
}
