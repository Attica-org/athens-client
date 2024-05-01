import EyeIcon from "@/assets/icons/EyeIcon";
import BackButton from "../../../_components/atoms/BackButton";
import ShareButton from "../atoms/ShareButton";
import AgoraTitle from "./AgoraTitle";
import HamburgerButton from "../atoms/HamburgerButton";

type Props = {
  toggleMenu: () => void;
};

export default function Header({ toggleMenu }: Props) {
  return (
    <div className="flex flex-col w-full justify-center">
      <div className="flex justify-between items-center pb-10 border-b-1 border-gray-200">
        <BackButton />
        <div className="flex justify-center items-center text-sm under-mobile:text-xs">
          <button className="italic bg-athens-main p-4 pl-15 pr-15 under-mobile:pl-10 under-mobile:pr-10 rounded-lg text-white mr-0.5rem">
            START
          </button>
          <div
            aria-label="토론 제한 시간"
            className="italic border-1 border-athens-main p-4 pl-15 pr-15 under-mobile:pl-10 under-mobile:pr-10 rounded-lg"
          >
            60:00
          </div>
          <div
            aria-label="토론 종료 버튼을 누른 인원 수"
            className="text-xs text-athens-gray-thick pl-0.5rem pr-0.5rem"
          >
            8
          </div>
          <div
            aria-label="관찰자 수"
            className="flex justify-center items-center"
          >
            <EyeIcon className="w-1rem" />
            <span className="pl-5 text-xs text-athens-gray-thick">12</span>
          </div>
        </div>
        <div className="flex justify-end items-center mr-0.5rem">
          <ShareButton />
          <HamburgerButton toggleMenu={toggleMenu} />
        </div>
      </div>
      <div className="flex justify-center items-center pt-0.5rem">
        <AgoraTitle />
      </div>
    </div>
  );
}
