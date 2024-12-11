import Image from 'next/image';
import React, { useEffect, useState } from 'react';

type ImageRendererProps = {
  file: { dataUrl: string; file: File };
  onImageLoaded: (e: HTMLImageElement) => void;
  imgRef: React.RefObject<HTMLImageElement>;
};

export default function ImageRenderer({
  file,
  onImageLoaded,
  imgRef,
}: ImageRendererProps) {
  const [imageDimensions, setImageDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);

  useEffect(() => {
    const image = new window.Image();
    image.src = file.dataUrl;

    image.onload = () => {
      const viewportWidth = window.innerWidth * 0.9; // 90% 뷰포트 너비
      const viewportHeight = window.innerHeight * 0.8; // 80% 뷰포트 높이

      const aspectRatio = image.width / image.height;
      let displayWidth = viewportWidth;
      let displayHeight = displayWidth / aspectRatio;

      if (displayHeight > viewportHeight) {
        displayHeight = viewportHeight;
        displayWidth = displayHeight * aspectRatio;
      }

      setImageDimensions({
        width: Math.round(displayWidth),
        height: Math.round(displayHeight),
      });
    };
  }, [file]);

  if (!imageDimensions) return null; // 이미지 로드 중

  return (
    <Image
      ref={imgRef}
      aria-label={file.file.name}
      src={file.dataUrl}
      alt={file.file.name}
      width={imageDimensions.width}
      height={imageDimensions.height}
      className="object-contain overflow-hidden"
      onLoad={({ currentTarget }) => onImageLoaded(currentTarget)}
    />
  );
}
