import UserImage from "../atoms/UserImage";

export default function SearchAgora() {
  return (
    <article className="w-full flex pb-0.5rem pl-1rem pr-1rem justify-center items-center cursor-pointer">
      <div className="relative">
        <UserImage />
        <span className="absolute top-0 right-0 inline-block w-0.5rem h-0.5rem bg-red-400 rounded-full ml-3" />
      </div>
      <div className="flex-1 p-0.5rem">
        <div className="flex justify-between items-start pb-5">
          <h3 className="text-sm under-mobile:text-xs break-words break-keep line-clamp-2 max-w-prose">
            국가 발전에는 유능한 독재자가 필요한 시기가 있다
          </h3>
          <div className="text-xs text-gray-500 pl-3">2024.04.14</div>
        </div>
        <div className="text-xxs text-nowrap">
          <span className="text-blue-500">
            찬성<span className="text-athens-gray-500 pl-3">10명 | </span>
          </span>
          <span className="text-red-500">
            반대<span className="text-athens-gray-500 pl-3">10명 | </span>
          </span>
          <span className="text-athens-gray-500">
            관찰자<span className="pl-3">10명</span>
          </span>
        </div>
      </div>
    </article>
  );
}
