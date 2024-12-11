'use client';

import AgoraImageUpload from '@/app/_components/organisms/AgoraImageUpload';
import { useCreateAgora } from '@/store/create';
import { initialImage, useUploadImage } from '@/store/uploadImage';
import isNull from '@/utils/validation/validateIsNull';
import React, { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';

export default function CreateAgoraImageUpload() {
  const { cropedPreview, setCropedPreview } = useUploadImage(
    useShallow((state) => ({
      cropedPreview: state.cropedPreview,
      setCropedPreview: state.setCropedPreview,
    })),
  );
  const { setThumbnail, thumbnail } = useCreateAgora(
    useShallow((state) => ({
      setThumbnail: state.setThumbnail,
      thumbnail: state.thumbnail,
    })),
  );

  useEffect(() => {
    if (isNull(cropedPreview.dataUrl)) {
      setThumbnail('');
    } else {
      setThumbnail(cropedPreview.dataUrl);
    }
  }, [cropedPreview.dataUrl, setThumbnail]);

  useEffect(() => {
    if (thumbnail === '') {
      setCropedPreview(initialImage);
    }
  }, [thumbnail]);

  return <AgoraImageUpload />;
}
