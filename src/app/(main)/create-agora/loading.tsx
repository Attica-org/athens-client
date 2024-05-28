import React from 'react';
import SideNav from '../_components/organisms/NavMenu';
import PageTitle from '../_components/atoms/PageTitle';
import Loading from '../flow/loading';

export default function CreateAgoraLoading() {
  return (
    <div>
      <SideNav />
      <section className="overflow-hidden scrollbar-hide flex flex-col flex-1 h-dvh max-lg:pb-3rem min-w-270 flex-grow max-width-screen dark:bg-dark-bg-light">
        <header className="p-1rem pb-0 relative min-w-270">
          <PageTitle
            title="아고라 생성"
            desc="생성할 아고라 정보를 입력해주세요."
          />
        </header>
        <div className="h-3/4">
          <Loading />
        </div>
      </section>
    </div>
  );
}
