import ServiceWorkerRegistration from '@/app/config/ServiceWorkerRegistration';
import React from 'react';

type Props = {
  children: React.ReactNode;
  modal: React.ReactNode;
};

export default function Layout({ children, modal }: Props) {
  return (
    <div className="overflow-x-hidden justify-center items-center w-full h-full">
      <ServiceWorkerRegistration />
      {children}
      {modal}
    </div>
  );
}
