import ServiceWorkerRegistration from '@/app/config/ServiceWorkerRegistration';
import React from 'react';
import AgoraSideBar from '../../_components/templates/AgoraSideBar';

type Props = {
  children: React.ReactNode;
  modal: React.ReactNode;
};

export default function Layout({ children, modal }: Props) {
  return (
    <div className="overflow-x-hidden justify-center items-center w-full h-full">
      <ServiceWorkerRegistration />
      <AgoraSideBar />
      {children}
      {modal}
    </div>
  );
}
