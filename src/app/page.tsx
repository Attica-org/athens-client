import AgoraStatus from "./_components/home/atoms/AgoraStatus";
import AgoraStatusTab from "./_components/home/atoms/AgoraStatusTab";
import CategoryButton from "./_components/home/atoms/CategoryButton";
import PageTitle from "./_components/home/atoms/PageTitle";
import SearchBar from "./_components/home/atoms/SearchBar";
import AgoraList from "./_components/home/molecules/AgoraList";
import CategoryButtonList from "./_components/home/molecules/CategoryButtonList";

export default function Home() {
  return (
    <section className="flex flex-col flex-1 h-dvh max-lg:pb-4rem">
      <header className="p-1rem">
        <PageTitle
          title="아고라 검색"
          desc="토론에 참여하고 싶은 아고라를 선택해주세요."
        >
          <AgoraStatus />
        </PageTitle>
        <SearchBar />
      </header>
      <main className="justify-center items-stretch flex flex-col h-fit flex-1 max-w-screen-2xl min-w-270">
        <section className="w-full">
          <AgoraStatusTab />
          <CategoryButtonList />
        </section>
        <section className="flex flex-1 p-0.5rem pb-5rem pt-1rem justify-center items-start">
          <AgoraList />
        </section>
      </main>
    </section>
  );
}
