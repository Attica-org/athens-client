'use client';

import AgoraImageUpload from '@/app/_components/molecules/AgoraImageUpload';
import { useMutation } from '@tanstack/react-query';
import React, { useState } from 'react';
import showToast from '@/utils/showToast';
import { patchAgoraImg } from '../../_lib/patchAgoraImg';
// import { useAgora } from "@/store/agora";

type Props = {
  thumbnail: string;
  agoraId: number;
};

export default function ModifyAgoraImage({ thumbnail, agoraId }: Props) {
  const [cropedPreview, setCropedPreview] = useState<
    Array<{ dataUrl: string; file: File }>
  >([
    {
      dataUrl: thumbnail,
      file: new File([], 'thumbnail'),
    },
  ]);

  const modifyAgoraImgMutation = useMutation({
    mutationFn: async () =>
      patchAgoraImg({
        agoraId,
        fileUrl: cropedPreview[0].dataUrl,
      }),
    retry: 2,
    onSuccess: async (response) => {
      if (response) {
        showToast('이미지가 변경되었습니다.', 'success');
        // useAgora의 enterAgora와 selectedAgora의 thumbnail 변경
        // const { setEnterAgora, enterAgora, setSelectedAgora, selectedAgora } = useAgora.getState();
      }
    },
    onError: () => {
      // console.dir(error);
      showToast('문제가 발생했습니다. 다시 시도해주세요.', 'error');
    },
  });

  const changeAgoraImg = () => {
    // 이미지 변경 서버 요청
    modifyAgoraImgMutation.mutate();
  };

  return (
    <div className="relative">
      <AgoraImageUpload
        setPreView={setCropedPreview}
        preView={cropedPreview}
        image={thumbnail}
      />
      {/* TODO: 이미지 수정 했을 때만 저장 버튼 출력하도록 수정 */}
      <button
        type="button"
        aria-label="변경한 이미지 저장"
        onClick={changeAgoraImg}
        className="absolute left-80 bottom-0 text-xs rounded-lg text-athens-sub z-5"
      >
        저장
      </button>
    </div>
  );
}
