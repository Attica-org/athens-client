import { ImageData } from '@/app/model/Agora';
import getCroppedImg from '@/utils/getCroppedImg';
import showToast from '@/utils/showToast';
import isNull from '@/utils/validation/validateIsNull';
import { useCallback, useState } from 'react';
import { Crop, convertToPixelCrop } from 'react-image-crop';

type HandleImgCropArg = {
  imgRef: React.RefObject<HTMLImageElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  setCropedPreview: (imageData: ImageData) => void;
  movePage: () => void;
};

export const useHandleImgCrop = ({
  imgRef,
  canvasRef,
  setCropedPreview,
  movePage,
}: HandleImgCropArg) => {
  const [loading, setLoading] = useState(false);
  const [makeCrop, setMakeCrop] = useState<Crop>();

  const handleImgCrop = useCallback(async () => {
    if (isNull(imgRef)) return;
    setLoading(true);

    try {
      await new Promise<void>((resolve) => {
        setTimeout(async () => {
          if (
            isNull(imgRef.current) ||
            isNull(canvasRef.current) ||
            isNull(makeCrop)
          ) {
            return;
          }

          const croppedImage = await getCroppedImg(
            imgRef.current,
            canvasRef.current,
            convertToPixelCrop(
              makeCrop,
              imgRef.current?.width,
              imgRef.current?.height,
            ),
            'image/jpeg',
            0.9, // 90% 품질의 JPEG로 변환
          );

          setCropedPreview({
            dataUrl: croppedImage,
            file: new File([croppedImage], 'image.jpeg', {
              type: 'image/jpeg',
            }),
          });

          resolve();
        }, 0); // 다음 이벤트 루프에서 실행
      });
    } catch (error) {
      showToast('이미지 자르기에 실패했습니다.', 'error');
    } finally {
      setLoading(false);
      movePage();
    }
  }, [makeCrop]);

  return {
    loading,
    setMakeCrop,
    handleImgCrop,
  };
};
