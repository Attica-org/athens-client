'use client';

import React, { useEffect } from 'react';
import Swiper from 'swiper';

// import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/mousewheel';
import { AGORACATEGORY } from '@/constants/consts';
import { useCategoryStatus } from '@/hooks/useCategoryStatus';
import CategoryButton from '../atoms/CategoryButton';

export default function CategoryButtonList() {
  const { category: selectedCategory, setCategory } = useCategoryStatus();

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

  const handleClickCategoryBtn = (value: keyof typeof AGORACATEGORY) => {
    setCategory(value);
  };

  return (
    <div className="w-full mt-10 mb-0 pb-0 pl-0.5rem pr-0.5rem flex text-nowrap overflow-hidden ml-5">
      <div className="swiper pr-1rem w-full">
        <div className="swiper-wrapper pr-1rem">
          {Object.values(AGORACATEGORY).map((category) => (
            <button
              type="button"
              aria-label={`${category.innerText} 카테고리`}
              onClick={() => handleClickCategoryBtn(category.value)}
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
