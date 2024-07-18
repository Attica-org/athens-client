'use client';

import React, { Suspense } from 'react';
import { useSearchStore } from '@/store/search';
import CategoryButtonList from '../molecules/CategoryButtonList';
import CategoryButtonListSkeleton from '../atoms/CategoryButtonListSkeleton';

export default function CategoryButtonContainer() {
  const { search } = useSearchStore();

  if (!search) {
    return (
      <Suspense fallback={<CategoryButtonListSkeleton />}>
        <CategoryButtonList />
      </Suspense>
    );
  }

  return null;
}
