'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const SearchAgoraList = dynamic(() => import('./SearchAgoraList'));
const AgoraList = dynamic(() => import('./AgoraList'));

type Props = {
  searchParams: { status?: string, category?: string, q?: string }
};

export default function SearchDecider({ searchParams }: Props) {
  const { q } = searchParams;

  if (q) {
    return <SearchAgoraList searchParams={searchParams} />;
  }
  return <AgoraList searchParams={searchParams} />;
}
