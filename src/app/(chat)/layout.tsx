import AgoraUserList from "../_components/chat/AgoraUserList";

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <div className="lg:flex justify-center items-center xl:w-[1580px] w-full">
      {children}
      <AgoraUserList />
    </div>
  );
}
