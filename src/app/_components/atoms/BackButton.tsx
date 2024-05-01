"use client";

import BackIcon from "@/assets/icons/BackIcon";
import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();

  const handleBack = () => {
    router.replace("/");
  };

  return (
    <button aria-label="뒤로가기">
      <BackIcon onClick={handleBack} className="w-22 ml-1rem cursor-pointer" />
    </button>
  );
}
