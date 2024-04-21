"use client";

import ShareIcon from "@/assets/icons/ShareIcon";

export default function ShareButton() {
  const shareSNS = () => {
    alert("공유하기 버튼 클릭");
  };

  return (
    <div onClick={shareSNS} className="cursor-pointer">
      <ShareIcon className="w-22 mr-1rem" />
    </div>
  );
}
