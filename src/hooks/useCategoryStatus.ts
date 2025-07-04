import { AGORACATEGORY } from '@/constants/consts';
import { homeSegmentKey } from '@/constants/segmentKey';
import { useCreateAgora } from '@/store/create';
import { useSearchStore } from '@/store/search';
import { isValidCategoryKey } from '@/utils/validation/validateCategoryKey';
import isNull from '@/utils/validation/validateIsNull';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';

export const useCategoryStatus = () => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { reset } = useSearchStore(
    useShallow((state) => ({
      reset: state.reset,
    })),
  );
  const { setCategory, category: selectedCategory } = useCreateAgora(
    useShallow((state) => ({
      setCategory: state.setCategory,
      category: state.category,
    })),
  );

  const getCategorySearchParams = (): keyof typeof AGORACATEGORY => {
    const categorySearchParams = searchParams.get('category');

    if (isNull(categorySearchParams)) return '1';

    if (categorySearchParams in AGORACATEGORY) {
      return categorySearchParams as keyof typeof AGORACATEGORY;
    }

    return '1';
  };

  useEffect(() => {
    setCategory(getCategorySearchParams());

    return () => {
      setCategory('1');
    };
  }, []);

  const changeCategoryParams = useCallback(
    (id: string) => {
      if (pathname !== homeSegmentKey) return;

      const newSearchParams = new URLSearchParams(searchParams);

      newSearchParams.set('category', isValidCategoryKey(id) ? id : '1');
      newSearchParams.delete('q');
      reset();

      const newUrl = `${homeSegmentKey}?${newSearchParams.toString()}`;
      window.history.pushState(
        { ...window.history.state, as: newUrl, url: newUrl },
        '',
        newUrl,
      );
    },
    [router, searchParams, pathname, selectedCategory],
  );

  useEffect(() => {
    changeCategoryParams(selectedCategory);
  }, [selectedCategory, changeCategoryParams]);

  return {
    setCategory,
    category: selectedCategory,
  };
};
