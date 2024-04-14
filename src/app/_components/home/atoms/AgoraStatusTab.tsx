export default function AgoraStatusTab() {
  // const state: "active" | "ended" = "active";

  return (
    <nav className="flex flex-row justify-around items-center h-2rem w-full text-xs ml-5 mr-5">
      <button className="border-b-1 border-athens-sub flex flex-1 justify-center p-6">
        활성화
      </button>
      <button className="flex flex-1 justify-center p-6 border-b-1">
        종료
      </button>
    </nav>
  );
}
