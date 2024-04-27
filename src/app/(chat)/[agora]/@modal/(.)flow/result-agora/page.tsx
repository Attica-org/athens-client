import ModalBase from "@/app/_components/molecules/ModalBase";
import Confetti from "@/utils/Confetti";
import Link from "next/link";

export default function Page() {
  let color = "bg-blue-400";

  return (
    <>
      <Confetti />
      <ModalBase title="최종 결과" removeIcon={true} animation={true}>
        <div className="flex justify-center items-center flex-col">
          <h2 className="break-keep text-center text-base font-semibold">
            {'"'}국가 발전에 유능한 독재자가 필요한 시기가 있다.{'"'}
          </h2>
          <button
            className={`${color} mt-1.5rem text-white p-5 pl-1.5rem pr-1.5rem text-sm rounded-lg`}
          >
            찬성 13
          </button>
          <Link href="/" className="pt-1.5rem text-sm text-gray-400">
            홈으로 돌아가기
          </Link>
        </div>
      </ModalBase>
    </>
  );
}
