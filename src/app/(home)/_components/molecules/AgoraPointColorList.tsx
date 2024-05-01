"use client";

import { Fragment, useState } from "react";
import AgoraPointColor from "../atoms/AgoraPointColor";

const COLOR = [
  { value: "bg-agora-point-color1", label: "청록색" },
  { value: "bg-agora-point-color2", label: "밝은 민트색" },
  { value: "bg-agora-point-color3", label: "연한 갈색" },
  { value: "bg-agora-point-color4", label: "연한 주황색" },
  { value: "bg-agora-point-color5", label: "연한 핑크색" },
  { value: "bg-agora-point-color6", label: "남색" },
];

export default function AgoraPointColorList() {
  const [isCheck, setIsCheck] = useState<number>(0);

  const selectColor = (id: number) => {
    setIsCheck(id);
  };

  return (
    <div className="flex">
      {Array.from({ length: COLOR.length }, (_, i) => (
        <button
          aria-label={`${COLOR[i].label}`}
          key={i}
          onClick={() => selectColor(i)}
        >
          <AgoraPointColor
            key={i}
            isCheck={isCheck === i}
            color={COLOR[i].value}
          />
        </button>
      ))}
    </div>
  );
}
