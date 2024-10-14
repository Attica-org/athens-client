'use client';

import AgoraImageUpload from '@/app/_components/molecules/AgoraImageUpload';
import { useCreateAgora } from '@/store/create';
import React, { useEffect, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';

export default function CreateAgoraImageUpload() {
  const [cropedPreview, setCropedPreview] = useState<string>('');
  const { setThumbnail, thumbnail } = useCreateAgora(
    useShallow((state) => ({
      setThumbnail: state.setThumbnail,
      thumbnail: state.thumbnail,
    })),
  );

  useEffect(() => {
    if (cropedPreview.length === 0) {
      setThumbnail('');
    } else {
      setThumbnail(cropedPreview);
    }
  }, [cropedPreview, setThumbnail]);

  useEffect(() => {
    if (thumbnail === '') {
      setCropedPreview('');
    } else if (cropedPreview.length === 0 && cropedPreview !== thumbnail) {
      setCropedPreview(thumbnail);
    }
  }, [thumbnail]);

  return (
    <AgoraImageUpload setPreView={setCropedPreview} preView={cropedPreview} />
  );
}
