'use client';

import React, { useCallback, useEffect, useState } from 'react';
import AGORACATEGORY from '@/constants/agoraCategory';
import Swiper from 'swiper';
import { useRouter, useSearchParams } from 'next/navigation';
import CategoryButton from '../atoms/CategoryButton';

import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/mousewheel';

export default function CategoryButtonList() {
  const search = '검색';
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>(0);
  const searchParams = useSearchParams();
  const router = useRouter();

  const changeParams = useCallback(() => {
    const newSearchParams = new URLSearchParams(searchParams);

    newSearchParams.set('category', AGORACATEGORY[selectedCategoryId].innerText);
    router.replace(`/?${newSearchParams.toString()}`);
  }, [router, searchParams, selectedCategoryId]);

  useEffect(() => {
    const swiper = new Swiper('.swiper', {
      direction: 'horizontal',
      loop: false,
      centeredSlides: false,
      touchRatio: 1,
      freeMode: true,
      grabCursor: true,
      slidesPerView: 'auto',
      spaceBetween: 7,
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
    changeParams();
  }, [changeParams]);

  const selectCategory = (id: number) => {
    changeParams();

    setSelectedCategoryId(id);
  };

  if (!search) return null;
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
