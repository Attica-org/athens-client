import React from 'react';
import Loader from '@/app/_components/atoms/loading';

export default function CreateAgoraLoading() {
  return (
    <section className="flex flex-col min-w-270 max-width-screen dark:bg-dark-bg-light h-full">
      <Loader className="flex justify-center items-center h-1/3" />
    </section>
  );
}
