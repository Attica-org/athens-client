import AgoraUserList from "./_components/chat/AgoraUserList";

export default function Home() {
  return (
    <main className="bg-yellow-400 justify-center items-stretch flex flex-1 flex-row h-dvh max-w-screen-2xl">
      <section>아고라 검색</section>
      <AgoraUserList />
    </main>
  );
}
