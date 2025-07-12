import { ImageData } from '@/app/model/Agora';
import { uploadImageSegmentKey } from '@/constants/segmentKey';
import showToast from '@/utils/showToast';
import isNull from '@/utils/validation/validateIsNull';
import { useRouter } from 'next/navigation';

type AgoraImageUploadActionArg = {
  page?: string;
  setUploadImage: (image: ImageData) => void;
};

export const useAgoraImageUploadAction = ({
  page,
  setUploadImage,
}: AgoraImageUploadActionArg) => {
  const router = useRouter();

  const onUpload = (files: FileList) => {
    Array.from(files).forEach((file) => {
      const allowedExtensions = ['jpg', 'jpeg', 'png', 'webp'];
      const fileName = file.name.toLowerCase();
      const fileExtension = fileName.split('.').pop();

      if (isNull(fileExtension) || !allowedExtensions.includes(fileExtension)) {
        showToast('지원하지 않는 이미지 형식입니다.', 'error');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadImage({
          dataUrl: reader.result as string,
          file,
        });
        if (page) {
          router.push(`${page}${uploadImageSegmentKey}`);
          return;
        }
        router.push(uploadImageSegmentKey);
      };
      reader.readAsDataURL(file);
    });
  };

  return onUpload;
};
