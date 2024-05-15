'use client';

import React from 'react';
import { useSearchStore } from '@/store/search';
import SearchAgoraList from './SearchAgoraList';
import AgoraList from './AgoraList';

type Props = {
  searchParams: { status?: string, category?: string, q?: string }
};

export default function SearchDecider({ searchParams }: Props) {
  const { search } = useSearchStore();

  if (search) {
    return <SearchAgoraList searchParams={searchParams} />;
  }
  return <AgoraList searchParams={searchParams} />;
}
