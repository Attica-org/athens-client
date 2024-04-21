"use client";

import BackIcon from "@/assets/icons/BackIcon";
import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();

  const handleBack = () => {
    router.replace("/");
  };

  return (
    <>
      <BackIcon onClick={handleBack} className="w-22 ml-1rem cursor-pointer" />
    </>
  );
}
