'use client';

import React, { Suspense } from 'react';
import { useSearchStore } from '@/store/search';
import { useShallow } from 'zustand/react/shallow';
import { usePathname } from 'next/navigation';
import { createAgoraSegmentKey } from '@/constants/segmentKey';
import CategoryButtonList from '../molecules/CategoryButtonList';
import CategoryButtonListSkeleton from '../atoms/CategoryButtonListSkeleton';

export default function CategoryButtonContainer() {
  const pathname = usePathname();
  const { search } = useSearchStore(
    useShallow((state) => ({
      search: state.search,
    })),
  );

  if (!search || pathname === createAgoraSegmentKey) {
    return (
      <Suspense fallback={<CategoryButtonListSkeleton />}>
        <CategoryButtonList />
      </Suspense>
    );
  }

  return null;
}
