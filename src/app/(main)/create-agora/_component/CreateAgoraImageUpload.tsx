'use client';

import AgoraImageUpload from '@/app/_components/organisms/AgoraImageUpload';
import { useCreateAgora } from '@/store/create';
import { initialImage, useUploadImage } from '@/store/uploadImage';
import { convertBase64ToBlobUrl } from '@/utils/convertBase64ToBlobUrl';
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
  const { setImageUrl, imageUrl } = useCreateAgora(
    useShallow((state) => ({
      setImageUrl: state.setImageUrl,
      imageUrl: state.imageUrl,
    })),
  );

  useEffect(() => {
    if (isNull(cropedPreview.dataUrl)) {
      setImageUrl('');
    } else {
      setImageUrl(convertBase64ToBlobUrl(cropedPreview.dataUrl));
    }
  }, [cropedPreview.dataUrl, setImageUrl]);

  useEffect(() => {
    if (isNull(imageUrl)) {
      setCropedPreview(initialImage);
    }
  }, [imageUrl]);

  return <AgoraImageUpload />;
}
