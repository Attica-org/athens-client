import RemoveIcon from "@/assets/icons/RemoveIcon";
import SearchIcon from "@/assets/icons/SearchIcon";

export default function SearchBar() {
  // TODO: 삭제 버튼 클릭 시 input 내용 삭제
  return (
    <div className="bg-athens-gray rounded-md p-7 flex justify-center items-center">
      <SearchIcon className="w-1rem ml-10" />
      <input
        type="text"
        className="w-full text-sm bg-athens-gray border-0 focus:outline-none pl-1rem placeholder:font-normal"
        placeholder="검색"
      />
      <div className="flex justify-center items-center w-1.5rem h-1.5rem">
        <RemoveIcon
          className="w-10"
          aria-label="입력한 검색 텍스트 전체 삭제 버튼"
        />
      </div>
    </div>
  );
}
