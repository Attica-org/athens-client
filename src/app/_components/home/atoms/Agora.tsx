export default function Agora() {
  return (
    <article className="w-7.5rem p-10 border-1 rounded-lg flex flex-col justify-center items-center">
      <h3 className="text-sm pb-3">쌀떡보다 밀떡</h3>
      <div className="w-3rem h-3rem rounded-full bg-yellow-400 relative">
        <div className="w-0.5rem h-0.5rem rounded-full bg-red-400 absolute top-2 right-3 z-10" />
      </div>
      <p className="text-xs pt-7">
        <div className="pb-1">
          <span className="pr-5 text-athens-gray-500 text-nowrap">
            <span className="text-blue-500 pr-3">찬성</span>10명
          </span>
          <span className="text-athens-gray-500 text-nowrap">
            <span className="text-red-500 pr-3">반대</span>10명
          </span>
        </div>
        <span>
          <span className="pr-3">관찰자</span>
          <span className="text-athens-gray-500">10명</span>
        </span>
      </p>
      <button className="text-xs text-white bg-athens-main p-4 pt-5 pb-5 mt-10 w-6rem rounded-md">
        입장하기
      </button>
    </article>
  );
}
