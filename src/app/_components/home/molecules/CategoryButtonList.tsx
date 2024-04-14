"use client";

import CategoryButton from "../atoms/CategoryButton";
// import { register, SwiperContainer, SwiperSlide } from "swiper/element/bundle";
// register();

const categoryList = [
  { innerText: "전체", isActive: true },
  { innerText: "지식/공부", isActive: false },
  { innerText: "문화/예술", isActive: false },
  { innerText: "음식/여행", isActive: false },
  { innerText: "일상/취미", isActive: false },
];

// TODO: swiper 적용 혹은 다른 라이브러리 찾아보기
export default function CategoryButtonList() {
  const search = "검색";

  if (search) return null;
  return (
    <div className="mt-10 flex text-nowrap overflow-hidden ml-5">
      {categoryList.map((category) => (
        <CategoryButton
          key={category.innerText}
          innerText={category.innerText}
          isActive={category.isActive}
        />
      ))}
    </div>
  );
}
