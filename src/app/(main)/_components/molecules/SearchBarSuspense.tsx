import React, { Suspense } from 'react';
import SearchBar from '../atoms/SearchBar';

export default function SearchBarSuspense() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchBar />
    </Suspense>
  );
}
