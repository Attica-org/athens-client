'use client';

import React, { useCallback, useEffect } from 'react';
import { AGORACATEGORY, isValidCategoryKey } from '@/constants/agoraCategory';
import Swiper from 'swiper';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useSearchStore } from '@/store/search';
import { useCreateAgora } from '@/store/create';
import { useShallow } from 'zustand/react/shallow';
import CategoryButton from '../atoms/CategoryButton';

// import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/mousewheel';

export default function CategoryButtonList() {
  const search = useSearchStore();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const categorySearchParams: string = searchParams.get('category') || '';
  const { setCategory, category: selectedCategory } = useCreateAgora(
    useShallow((state) => ({
      setCategory: state.setCategory,
      category: state.category,
    })),
  );

  useEffect(() => {
    if (categorySearchParams) {
      setCategory(categorySearchParams);
    }

    return () => {
      setCategory('1');
    };
  }, []);

  const changeCategoryParams = useCallback(
    (id: string) => {
      if (pathname !== '/home') return;

      const newSearchParams = new URLSearchParams(searchParams);

      newSearchParams.set('category', isValidCategoryKey(id) ? id : '1');
      newSearchParams.delete('q');
      search.reset();

      const newUrl = `/home?${newSearchParams.toString()}`;
      window.history.pushState(
        { ...window.history.state, as: newUrl, url: newUrl },
        '',
        newUrl,
      );
      // router.push(`/home?${newSearchParams.toString()}`);
    },
    [router, searchParams, pathname, selectedCategory],
  );

  useEffect(() => {
    const swiper = new Swiper('.swiper', {
      direction: 'horizontal',
      loop: false,
      centeredSlides: false,
      touchRatio: 1,
      freeMode: true,
      grabCursor: true,
      slidesPerView: 'auto',
      spaceBetween: 0,
      keyboard: {
        enabled: true,
        onlyInViewport: false,
      },
    });

    return () => {
      swiper.destroy();
    };
  }, []);

  useEffect(() => {
    changeCategoryParams(selectedCategory);
  }, [selectedCategory, changeCategoryParams]);

  return (
    <div className="w-full mt-10 mb-0 pb-0 pl-0.5rem pr-0.5rem flex text-nowrap overflow-hidden ml-5">
      <div className="swiper pr-1rem w-full">
        <div className="swiper-wrapper pr-1rem">
          {Object.values(AGORACATEGORY).map((category) => (
            <button
              type="button"
              aria-label="카테고리"
              onClick={() => setCategory(category.value)}
              className="swiper-slide"
              key={category.innerText}
            >
              <CategoryButton
                innerText={category.innerText}
                isActive={category.value === selectedCategory}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
