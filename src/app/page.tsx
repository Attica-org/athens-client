import Image from "next/image";
import AgoraUserList from "./_components/AgoraUserList";
import SideNav from "./_components/home/SideNav";

export default function Home() {
  return (
    <main className="flex flex-1 flex-row h-dvh max-w-screen-2xl">
      <SideNav />
      <section className="bg-yellow-400 flex-1"></section>
      <AgoraUserList />
    </main>
  );
}
