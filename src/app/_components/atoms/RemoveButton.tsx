"use client";

import RemoveIcon from "@/assets/icons/RemoveIcon";
import { useRouter } from "next/navigation";

type Props = {
  className?: string;
};

export default function RemoveButton({ className }: Props) {
  const router = useRouter();

  const onClickClose = () => {
    router.back();
  };

  return (
    <button
      aria-label="모달창 닫기"
      onClick={onClickClose}
      className={className}
    >
      <div aria-hidden>
        <RemoveIcon className="w-1rem cursor-pointer" />
      </div>
    </button>
  );
}
