'use client';

import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import ErrorFallback from '@/app/_components/templates/ErrorFallback';
import Loading from '@/app/_components/atoms/loading';

const KeywordAgoraList = dynamic(() => import('./KeywordAgoraList'), {
  loading: () => (
    <Loading w="25" h="25" className="m-5 flex justify-center items-center" />
  ),
  ssr: false,
});

const CategoryAgoraList = dynamic(() => import('./CategoryAgoraList'), {
  loading: () => (
    <Loading w="25" h="25" className="m-5 flex justify-center items-center" />
  ),
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
        <Suspense
          fallback={
            <Loading
              w="25"
              h="25"
              className="m-5 flex justify-center items-center"
            />
          }
        >
          <KeywordAgoraList searchParams={searchParams} />
        </Suspense>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary FallbackComponent={FallbackComponent}>
      <Suspense
        fallback={
          <Loading
            w="25"
            h="25"
            className="m-5 flex justify-center items-center"
          />
        }
      >
        <CategoryAgoraList searchParams={searchParams} />
      </Suspense>
    </ErrorBoundary>
  );
}
