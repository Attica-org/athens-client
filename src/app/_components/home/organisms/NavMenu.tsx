import Link from "next/link";
import Image from "next/image";
import NavLinks from "../molecules/NavLinks";

export default function SideNav() {
  return (
    <nav className="relative flex-1 max-w-14rem flex-grow border-r-2 border-r-gray-50">
      <div className="hidden lg:block fixed h-dvh xl:w-14rem lg:w-13rem pl-3rem ">
        <div className="w-lg flex flex-col">
          <div className="flex-col">
            <Link
              href={"/"}
              className="flex flex-row text-2xl pt-1rem pb-1rem p-1rem"
            >
              <Image
                src={"/logo.png"}
                alt={"Athens 로고"}
                width={32}
                height={32}
              />
            </Link>
            <NavLinks />
          </div>
        </div>
      </div>
      <div className="block lg:hidden w-full fixed bottom-0rem bg-white z-10">
        <div className="w-lg flex flex-row justify-center items-center">
          <NavLinks />
        </div>
      </div>
    </nav>
  );
}
