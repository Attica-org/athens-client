"use client";

import RemoveIcon from "@/assets/icons/RemoveIcon";
import { useRouter } from "next/navigation";

type Props = {
  className?: string;
};

export default function BackButton({ className }: Props) {
  const router = useRouter();

  const onClickClose = () => {
    router.back();
  };

  return (
    <div onClick={onClickClose} className={className}>
      <RemoveIcon className="w-1rem cursor-pointer" />
    </div>
  );
}
