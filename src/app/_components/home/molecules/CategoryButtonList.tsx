"use client";

import CategoryButton from "../atoms/CategoryButton";
import Swiper from "swiper";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/mousewheel";
import { useEffect } from "react";

const categoryList = [
  { innerText: "전체", isActive: true },
  { innerText: "지식/공부", isActive: false },
  { innerText: "문화/예술", isActive: false },
  { innerText: "음식/여행", isActive: false },
  { innerText: "일상/취미", isActive: false },
];

export default function CategoryButtonList() {
  const search = "검색";

  useEffect(() => {
    const swiper = new Swiper(".swiper", {
      direction: "horizontal",
      loop: false,
      centeredSlides: false,
      touchRatio: 1,
      freeMode: true,
      grabCursor: true,
      slidesPerView: "auto",
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

  if (!search) return null;
  return (
    <div className="w-full mt-10 mb-0 pb-0 pr-1rem pl-0.5rem flex text-nowrap overflow-hidden ml-5">
      <div className="swiper pr-1rem">
        <div className="swiper-wrapper pr-1rem">
          {categoryList.map((category) => (
            <div className="swiper-slide" key={category.innerText}>
              <CategoryButton
                innerText={category.innerText}
                isActive={category.isActive}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
