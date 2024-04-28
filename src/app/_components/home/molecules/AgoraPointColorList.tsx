"use client";

import { useState } from "react";
import AgoraPointColor from "../atoms/AgoraPointColor";

const COLORLENGTH = 6;

export default function AgoraPointColorList() {
  const [isCheck, setIsCheck] = useState<number>(0);

  const selectColor = (id: number) => {
    setIsCheck(id);
  };

  return (
    <div className="flex">
      {Array.from({ length: COLORLENGTH }, (_, i) => (
        <>
          <div onClick={() => selectColor(i)}>
            <AgoraPointColor key={i} id={i + 1} isCheck={isCheck === i} />
          </div>
        </>
      ))}
    </div>
  );
}
