import UserImage from "../../atoms/UserImage";

export default function SearchAgora() {
  return (
    <article className="w-full flex pb-18 mb-1rem pl-1rem pr-1rem justify-center items-center cursor-pointer border-b-1 border-gray-100">
      <div className="flex-1 p-0.5rem pl-0">
        <div className="flex justify-between items-start pb-5">
          <h3 className="text-sm under-mobile:text-xs break-words break-keep line-clamp-2 max-w-prose">
            국가 발전에는 유능한 독재자가 필요한 시기가 있다
          </h3>
        </div>
        <div className="text-xs text-nowrap">
          <span className="text-blue-500">
            찬성<span className="text-athens-gray-500 pl-3">10명 | </span>
          </span>
          <span className="text-red-500">
            반대<span className="text-athens-gray-500 pl-3">10명 | </span>
          </span>
          <span>
            관찰자<span className="pl-3 text-athens-gray-500">10명</span>
          </span>
        </div>
      </div>
      <div className="relative">
        <UserImage className="min-w-5rem h-5rem bg-yellow-400" />
        <span className="absolute top-0 left-4rem inline-block w-13 h-13 bg-red-400 rounded-full ml-3" />
      </div>
    </article>
  );
}
