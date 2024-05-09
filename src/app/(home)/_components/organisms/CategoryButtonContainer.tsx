'use client';

import React from 'react';
import { useSearchStore } from '@/store/search';
import CategoryButtonList from '../molecules/CategoryButtonList';

export default function CategoryButtonContainer() {
  const { search } = useSearchStore();

  if (!search) {
    return (
      <CategoryButtonList />
    );
  }

  return null;
}
