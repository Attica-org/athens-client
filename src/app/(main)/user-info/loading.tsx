import React from 'react';
import Loader from '@/app/_components/atoms/loading';
import DeferredComponent from '@/app/_components/utils/DefferedComponent';

export default function UserInfoLoading() {
  return (
    <section className="flex flex-col min-w-270 max-width-screen dark:bg-dark-bg-light h-full w-full">
      <DeferredComponent>
        <Loader className="flex justify-center items-center h-3/1" />
      </DeferredComponent>
    </section>
  );
}
