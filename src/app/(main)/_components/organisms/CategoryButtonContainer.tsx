'use client';

import React, { Suspense } from 'react';
import { useSearchStore } from '@/store/search';
import CategoryButtonList from '../molecules/CategoryButtonList';

function CategoryButtonContainer() {
  const { search } = useSearchStore();

  if (!search) {
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <CategoryButtonList />
      </Suspense>
    );
  }

  return null;
}

export default React.memo(CategoryButtonContainer);
