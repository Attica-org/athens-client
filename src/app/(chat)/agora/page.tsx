import AgoraList from "@/app/_components/home/molecules/AgoraList";
import Header from "@/app/_components/chat/molecules/Header";
import MessageInput from "@/app/_components/chat/molecules/MessageInput";

export default function Page() {
  return (
    <section className="flex flex-col flex-1 h-dvh max-lg:pb-3rem min-w-270 flex-grow max-width-screen relative">
      <header className="flex sticky top-0 z-10 bg-white justify-between items-center pt-10 pb-5 min-w-270 border-b-1 border-gray-200">
        <Header />
      </header>
      <main className="justify-center items-stretch flex flex-col h-fit flex-1 relative">
        <section className="flex flex-1 flex-col">
          {/* <AgoraList /> */}
          <div className="flex p-0.5rem pl-1.5rem pr-1.5rem">
            <div className="rounded-lg text-center flex justify-center items-center text-sm text-gray-400 p-1rem bg-athens-gray w-full break-keep">
              사용자들간의 쾌적한 토론 환경을 위해 바른말을 사용해주세요.
            </div>
          </div>
        </section>
        <MessageInput />
      </main>
    </section>
  );
}
