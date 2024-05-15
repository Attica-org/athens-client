'use client';

import React, { useCallback, useEffect, useState } from 'react';
import AGORACATEGORY from '@/constants/agoraCategory';
import Swiper from 'swiper';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useSearchStore } from '@/store/search';
import { useCreateAgora } from '@/store/create';
import { useShallow } from 'zustand/react/shallow';
import CategoryButton from '../atoms/CategoryButton';

import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/mousewheel';

function CategoryButtonList() {
  const search = useSearchStore();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const catSearchParams = searchParams.get('category');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>(
    catSearchParams
      ? AGORACATEGORY.findIndex((category) => category.innerText === catSearchParams)
      : 0,
  );

  const { setCategory } = useCreateAgora(
    useShallow((state) => ({ setCategory: state.setCategory })),
  );

  const changeParams = useCallback((id: number) => {
    const newSearchParams = new URLSearchParams(searchParams);

    newSearchParams.set('category', AGORACATEGORY[id].innerText);
    newSearchParams.delete('q');
    search.reset();

    router.replace(`/home?${newSearchParams.toString()}`);
  }, [router, searchParams, search]);

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

  const selectCategory = (id: number) => {
    setSelectedCategoryId(() => {
      const newState = id;

      if (pathname === '/home') {
        changeParams(id);
      }
      if (pathname === '/create-agora') {
        setCategory(AGORACATEGORY[id].value);
      }

      return newState;
    });
  };

  return (
    <div className="w-full mt-10 mb-0 pb-0 pl-0.5rem pr-0.5rem flex text-nowrap overflow-hidden ml-5">
      <div className="swiper pr-1rem w-full">
        <div className="swiper-wrapper pr-1rem">
          {AGORACATEGORY.map((category) => (
            <button
              type="button"
              aria-label="카테고리 선택"
              onClick={() => selectCategory(category.id)}
              className="swiper-slide"
              key={category.innerText}
            >
              <CategoryButton
                innerText={category.innerText}
                isActive={category.id === selectedCategoryId}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default React.memo(CategoryButtonList);
