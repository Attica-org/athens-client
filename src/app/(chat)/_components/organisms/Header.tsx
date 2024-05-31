'use client';

import React, { useEffect } from 'react';
import { useSidebarStore } from '@/store/sidebar';
import { useShallow } from 'zustand/react/shallow';
import { useVoteStore } from '@/store/vote';
import { usePathname, useRouter } from 'next/navigation';
import BackButton from '../../../_components/atoms/BackButton';
import ShareButton from '../atoms/ShareButton';
import AgoraTitle from '../molecules/AgoraTitle';
import HamburgerButton from '../atoms/HamburgerButton';
import DiscussionStatus from '../molecules/DiscussionStatus';

// TODO: 웹소켓 메타정보로 얻어오기
const title = '기후 변화 대책에 대한 토론';

export default function Header() {
  const { toggle } = useSidebarStore(
    useShallow((state) => ({ toggle: state.toggle })),
  );
  const { voteEnd } = useVoteStore(useShallow((state) => ({
    voteEnd: state.voteEnd,
  })));
  const router = useRouter();
  const agoraId = usePathname().split('/').pop() as string;

  const toggleMenu = () => {
    toggle();
  };

  useEffect(() => {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        action: 'initialize',
        baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
      });
    }
  }, []);

  useEffect(() => {
    if (voteEnd) {
      console.log('푀종 투표 종료');
      // router.push(`/agoras/${agoraId}/flow/result-agora`);
    }
  }, [voteEnd, agoraId, router]);

  // TODO: 메타데이터 웹 소켓 연결

  return (
    <div className="flex flex-col w-full justify-center dark:text-white dark:text-opacity-85">
      <div className="flex justify-between items-center pb-10 border-b-1 border-gray-200 dark:border-dark-bg-light">
        <BackButton />
        <div className="flex justify-center items-center text-sm under-mobile:text-xs">
          <DiscussionStatus />
        </div>
        <div className="flex justify-end items-center mr-0.5rem">
          <ShareButton title={title} />
          <HamburgerButton toggleMenu={toggleMenu} />
        </div>
      </div>
      <div className="flex justify-center items-center pt-0.5rem">
        <AgoraTitle title={title} />
      </div>
    </div>
  );
}
