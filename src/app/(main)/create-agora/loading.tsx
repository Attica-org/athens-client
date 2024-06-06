import React from 'react';
import Loader from './_component/Loader';

export default function CreateAgoraLoading() {
  return (
    <section className="flex flex-col min-w-270 max-width-screen dark:bg-dark-bg-light h-full">
      <Loader />
    </section>
  );
}
