import AgoraStatus from "./_components/home/atoms/AgoraStatus";
import AgoraStatusTab from "./_components/home/atoms/AgoraStatusTab";
import PageTitle from "./_components/home/atoms/PageTitle";
import SearchBar from "./_components/home/atoms/SearchBar";

export default function Home() {
  return (
    <section className="flex flex-col flex-1 h-dvh md:pb-4rem">
      <header className="p-1rem">
        <PageTitle
          title="아고라 검색"
          desc="토론에 참여하고 싶은 아고라를 선택해주세요."
        >
          <AgoraStatus />
        </PageTitle>
        <SearchBar />
      </header>
      <main className="bg-yellow-400 justify-center items-stretch flex flex-1 flex-row h-dvh max-w-screen-2xl">
        <AgoraStatusTab />
      </main>
    </section>
  );
}
