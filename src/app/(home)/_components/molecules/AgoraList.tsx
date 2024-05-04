import React from 'react';
import Agora from '../atoms/Agora';

export default function AgoraList() {
  return (
    <div className="grid under-large:grid-cols-5 gap-x-1rem gap-y-1rem under-mobile:grid-cols-2 mobile:grid-cols-2 foldable:grid-cols-3 tablet:grid-cols-4 under-tablet:grid-cols-4 xl:grid-cols-6 sm:grid-cols-3 lg:grid-cols-5 under-xl:grid-cols-4">
      <Agora />
      <Agora />
      <Agora />
      <Agora />
      <Agora />
      <Agora />
      <Agora />
      <Agora />
      <Agora />
      <Agora />
      <Agora />
    </div>
  );
}
