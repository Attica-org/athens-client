import Agora from "../atoms/Agora";

// mobile: '360px' // @media (min-width: 360px)
// foldable: '523px' // @media (min-width: 523px)
// tablet: '768px' // @media (min-width: 768px)
// 'under-foldable': { max: '522px' } // @media (max-width: 522px)
// 'under-tablet': { max: '767px' } // @media (max-width: 767px)
// 'under-mobile': { max: '359px' } // @media (max-width: 359px)
// 'sm': '640px' // @media (min-width: 640px)
// 'md': '768px' // @media (min-width: 768px)
// 'lg': '1024px' // @media (min-width: 1024px)
// 'xl': '1280px' // @media (min-width: 1280px)
// '2xl': '1536px' // @media (min-width: 1536px)

export default function AgoraList() {
  return (
    <div className="grid under-large:grid-cols-5 gap-x-1rem gap-y-1rem under-mobile:grid-cols-2 mobile:grid-cols-2 foldable:grid-cols-3 tablet:grid-cols-4 under-tablet:grid-cols-4 xl:grid-cols-6 sm:grid-cols-3 lg:grid-cols-5 under-xl:grid-cols-4">
      <Agora />
      <Agora />
      <Agora />
      <Agora />
      <Agora />
      <Agora />
      <Agora />
      <Agora />
      <Agora />
      <Agora />
      <Agora />
    </div>
  );
}
