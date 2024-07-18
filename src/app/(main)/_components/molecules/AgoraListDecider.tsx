'use client';

import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import ErrorFallback from '@/app/_components/templates/ErrorFallback';
import { SearchParams } from '@/app/model/Agora';
import Loading from '../atoms/loading';

const KeywordAgoraList = dynamic(() => import('./KeywordAgoraList'), {
  loading: () => <Loading w="25" h="25" />,
});

const CategoryAgoraList = dynamic(() => import('./CategoryAgoraList'), {
  loading: () => <Loading w="25" h="25" />,
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

  if (q) {
    return (
      <ErrorBoundary FallbackComponent={FallbackComponent}>
        <Suspense fallback={<Loading w="25" h="25" />}>
          <KeywordAgoraList searchParams={searchParams} />
        </Suspense>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary FallbackComponent={FallbackComponent}>
      <Suspense fallback={<Loading w="25" h="25" />}>
        <CategoryAgoraList searchParams={searchParams} />
      </Suspense>
    </ErrorBoundary>
  );
}
