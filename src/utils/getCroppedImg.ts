import { PixelCrop } from 'react-image-crop';

const getCroppedImg = async (
  image: HTMLImageElement,
  originalCanvas: HTMLCanvasElement,
  crop: PixelCrop,
  format: 'image/png' | 'image/jpeg' = 'image/jpeg', // 기본값을 JPEG로 설정
  quality: number = 0.9, // JPEG 품질 설정
): Promise<string> => {
  const canvas = originalCanvas;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('No 2d context');
  }

  // const pixelRatio = 1; // 👉 필요 없으면 1로 고정
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;

  // 📌 크롭된 크기만큼만 canvas 크기를 설정 (해상도 증가 방지)
  canvas.width = Math.floor(crop.width * scaleX);
  canvas.height = Math.floor(crop.height * scaleY);

  ctx.imageSmoothingQuality = 'high';
  ctx.save();

  const cropX = crop.x * scaleX;
  const cropY = crop.y * scaleY;

  // 📌 크롭된 영역만 캔버스에 그림
  ctx.drawImage(
    image,
    cropX,
    cropY,
    crop.width * scaleX,
    crop.height * scaleY, // 크롭된 부분만 가져오기
    0,
    0,
    canvas.width,
    canvas.height,
  );

  ctx.restore();

  return canvas.toDataURL(format, quality);
};

export default getCroppedImg;
