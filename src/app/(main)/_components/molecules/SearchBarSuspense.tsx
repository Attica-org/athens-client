import React, { Suspense } from 'react';
import SearchBar from '../atoms/SearchBar';
import SearchBarSkeleton from '../atoms/SearchBarSkeleton';

export default function SearchBarSuspense() {
  return (
    <Suspense fallback={<SearchBarSkeleton />}>
      <SearchBar />
    </Suspense>
  );
}
