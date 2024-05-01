import ModalBase from "@/app/_components/molecules/ModalBase";
import Confetti from "@/utils/Confetti";
import Link from "next/link";

export default function ResultAgora() {
  let color = "bg-blue-400";

  return (
    <>
      <Confetti />
      <ModalBase title="투표 결과" removeIcon={true} animation={true}>
        <div className="flex justify-center items-center flex-col">
          <h2
            aria-label="토론 주제"
            className="break-keep text-center text-base font-semibold"
          >
            국가 발전에 유능한 독재자가 필요한 시기가 있다.
          </h2>
          <div
            aria-label="더 많은 표를 얻은 측"
            className={`${color} mt-1.5rem text-white p-5 pl-1.5rem pr-1.5rem text-sm rounded-lg`}
          >
            찬성 13
          </div>
          <Link
            aria-label="홈으로 가기"
            href="/"
            className="pt-1.5rem text-sm text-athens-gray-thick"
          >
            홈으로 돌아가기
          </Link>
        </div>
      </ModalBase>
    </>
  );
}
