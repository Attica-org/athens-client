import HomeIcon from "@/assets/icons/homeIcon";
import AddIcon from "@/assets/icons/AddIcon";
import MobileNavLink from "../atoms/MobileNavLink";
import DesktopNavLink from "../atoms/DesktopNavLink";

export default function NavLinks() {
  return (
    <>
      <div className="hidden lg:block">
        <ul>
          <DesktopNavLink href="/" innerText="홈">
            <HomeIcon className="w-1.5rem" />
          </DesktopNavLink>
          <DesktopNavLink href="/create-agora" innerText="아고라 생성">
            <AddIcon className="w-1.5rem" />
          </DesktopNavLink>
        </ul>
      </div>
      <div className="block lg:hidden w-full h-58 border-t-2 border-gray-100">
        <ul className="flex flex-row h-full justify-around">
          <MobileNavLink
            className="flex p-5 text-xs flex-col justify-center items-center"
            href="/"
          >
            <HomeIcon className="w-23 pb-2" />홈
          </MobileNavLink>
          <MobileNavLink
            className="flex flex-col text-xs justify-center items-center p-10"
            href="/create-agora"
          >
            <AddIcon className="w-23 pb-2" />
            아고라생성
          </MobileNavLink>
        </ul>
      </div>
    </>
  );
}
