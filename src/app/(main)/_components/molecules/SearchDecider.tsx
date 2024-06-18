'use client';

import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import Loading from '../atoms/loading';

const SearchAgoraList = dynamic(() => import('./SearchAgoraList'));
const AgoraList = dynamic(() => import('./AgoraList'));

type Props = {
  searchParams: { status?: string, category?: string, q?: string }
};

export default function SearchDecider({ searchParams }: Props) {
  const { q } = searchParams;

  if (q) {
    return (
      <Suspense fallback={<Loading />}>
        <SearchAgoraList searchParams={searchParams} />
      </Suspense>
    );
  }

  return (
    <Suspense fallback={<Loading />}>
      <AgoraList searchParams={searchParams} />
    </Suspense>
  );
}
