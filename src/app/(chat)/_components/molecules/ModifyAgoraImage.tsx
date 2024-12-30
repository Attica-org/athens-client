'use client';

import AgoraImageUpload from '@/app/_components/organisms/AgoraImageUpload';
import { useMutation } from '@tanstack/react-query';
import React from 'react';
import showToast from '@/utils/showToast';
import { useAgora } from '@/store/agora';
import useApiError from '@/hooks/useApiError';
import { useUploadImage } from '@/store/uploadImage';
import { useShallow } from 'zustand/react/shallow';
import { patchAgoraImg } from '../../_lib/patchAgoraImg';

export default function ModifyAgoraImage() {
  const { enterAgora } = useAgora();
  const { handleError } = useApiError();
  const { cropedPreview } = useUploadImage(
    useShallow((state) => ({
      cropedPreview: state.cropedPreview,
    })),
  );

  const modifyAgoraImgMutation = useMutation({
    mutationFn: async () =>
      patchAgoraImg({
        agoraId: enterAgora.id,
        fileUrl: cropedPreview.dataUrl,
      }),
    onSuccess: async (response) => {
      if (response) {
        showToast('이미지가 변경되었습니다.', 'success');
        // useAgora의 enterAgora와 selectedAgora의 thumbnail 변경
        const { setEnterAgora, setSelectedAgora, selectedAgora } =
          useAgora.getState();
        setEnterAgora({ ...enterAgora, thumbnail: cropedPreview.dataUrl });
        setSelectedAgora({
          ...selectedAgora,
          thumbnail: cropedPreview.dataUrl,
        });
      }
    },
    onError: async (error) => {
      await handleError(error, modifyAgoraImgMutation.mutate);
    },
  });

  const changeAgoraImg = () => {
    // 이미지 변경 서버 요청
    modifyAgoraImgMutation.mutate();
  };

  return (
    <div className="relative">
      <AgoraImageUpload
        page={`/agoras/${enterAgora.id}`}
        image={enterAgora.thumbnail}
        color={enterAgora.agoraColor}
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
