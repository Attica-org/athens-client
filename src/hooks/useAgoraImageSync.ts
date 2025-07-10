import { useCreateAgora } from '@/store/create';
import { initialImage, useUploadImage } from '@/store/uploadImage';
import { convertBase64ToBlobUrl } from '@/utils/convertBase64ToBlobUrl';
import isNull from '@/utils/validation/validateIsNull';
import { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';

export const useAgoraImageSync = () => {
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
};
