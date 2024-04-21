import SideNav from "../_components/home/organisms/NavMenu";

type Props = {
  children: React.ReactNode;
  modal: React.ReactNode;
};

export default function Layout({ children, modal }: Props) {
  return (
    <div className="lg:flex scrollbar-hide justify-center items-start xl:w-[1580px] lg:w-[1024px] tablet:w-[706px] under-large:w-full">
      <SideNav />
      {children}
      {modal}
    </div>
  );
}
