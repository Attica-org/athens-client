import AgoraStatus from "../_components/home/atoms/AgoraStatus";
import AgoraStatusTab from "../_components/home/atoms/AgoraStatusTab";
import PageTitle from "../_components/home/atoms/PageTitle";
import SearchBar from "../_components/home/atoms/SearchBar";
import AgoraList from "../_components/home/molecules/AgoraList";
import CategoryButtonList from "../_components/home/molecules/CategoryButtonList";
import SearchAgoraList from "../_components/home/organisms/SearchAgoraList";

export default function Home() {
  return (
    <section className="flex flex-col flex-1 h-dvh max-lg:pb-3rem min-w-270 flex-grow max-width-screen">
      <header className="p-1rem pb-0 relative min-w-270">
        <PageTitle
          title="아고라 검색"
          desc="토론에 참여하고 싶은 아고라를 선택해주세요."
        >
          <AgoraStatus />
        </PageTitle>
      </header>
      <main className="justify-center items-stretch flex flex-col h-fit flex-1 relative">
        <section className="sticky top-0 z-10 bg-white">
          <div className="p-1rem pt-8 pb-0.5rem">
            <SearchBar />
          </div>
          <div className="w-full pb-0.5rem">
            <AgoraStatusTab />
            <CategoryButtonList />
          </div>
        </section>
        <section className="flex flex-1 flex-col p-0.5rem pb-5rem pt-1rem justify-start items-center">
          {/* <SearchAgoraList /> */}
          <AgoraList />
        </section>
      </main>
    </section>
  );
}
