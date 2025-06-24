'use client';

import RemoveIcon from '@/assets/icons/RemoveIcon';
import React, {
  KeyboardEventHandler,
  MouseEventHandler,
  Suspense,
  useEffect,
  useRef,
} from 'react';
import { useSidebarStore } from '@/store/sidebar';
import { useShallow } from 'zustand/react/shallow';
import { useAgora } from '@/store/agora';
import Image from 'next/image';
import { AGORA_STATUS } from '@/constants/agora';
import { isValidImgUrl } from '@/utils/validation/validateImage';
import isNull from '@/utils/validation/validateIsNull';
import AgoraUserSuspense from '../organisms/AgoraUserSuspense';
import AgoraUserSideSkeleton from '../organisms/AgoraUserSideSkeleton';
import ChatSideModule from '../molecules/ChatSideModule';
import ModifyAgoraImage from '../molecules/ModifyAgoraImage';

export default function AgoraSideBar() {
  const mainRef = useRef<HTMLElement>(null);
  const { toggle, isOpen, hamburgerButtonRef } = useSidebarStore(
    useShallow((state) => ({
      toggle: state.toggle,
      isOpen: state.isOpen,
      hamburgerButtonRef: state.hamburgerButtonRef,
    })),
  );
  const { enterAgora } = useAgora(
    useShallow((state) => ({
      enterAgora: state.enterAgora,
    })),
  );

  const onClickOutSide: MouseEventHandler<HTMLDivElement> = (e) => {
    if (e.target === e.currentTarget) {
      toggle();
    }
  };

  const onKeyDownOutSide: KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (e.key === 'Enter' && e.target === e.currentTarget) {
      toggle();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      toggle();
    }
  };

  useEffect(() => {
    const element = mainRef.current;
    if (isOpen && element) {
      // 모달이 열릴 때 포커스를 모달로 이동
      element.setAttribute('aria-modal', 'true');
      element.setAttribute('aria-hidden', 'false');
      element.focus();
    }

    if (!isOpen && element && !isNull(hamburgerButtonRef)) {
      // 모달이 닫힐 때 포커스를 모달 밖으로 이동
      element.setAttribute('aria-modal', 'false');
      element.setAttribute('aria-hidden', 'true');
      element.blur();

      requestAnimationFrame(() => {
        hamburgerButtonRef.current?.focus();
      });
    }
  }, [isOpen]);

  return (
    <section
      className={`fixed inset-0 z-50 bg-opacity-50 bg-dark-bg-dark transition-opacity duration-500 ${
        !isOpen ? 'pointer-events-none opacity-0' : 'opacity-100'
      }`}
      aria-hidden={!isOpen}
      aria-label="사이드 메뉴 모달"
    >
      <div
        aria-hidden
        onKeyDown={onKeyDownOutSide}
        onClick={onClickOutSide}
        className="w-full h-full"
      >
        <div
          className={`min-w-250 absolute inset-y-0 right-0 flex flex-col max-w-full pl-10 ${
            isOpen ? 'z-15' : 'pointer-events-none'
          }`}
        >
          <main
            ref={mainRef}
            aria-modal="true"
            role="dialog"
            className={`relative right-0 top-0 h-full w-full p-1.5rem bg-white dark:bg-dark-light-300 shadow-lg transition-transform duration-500 ease-in-out overflow-y-auto max-w-15rem xl:w-15rem border-l-1 border-athens-gray dark:border-dark-light-300 ${
              isOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
            tabIndex={-1}
            aria-labelledby="title"
          >
            <h2
              id="title"
              aria-describedby="sidebar-description"
              className="sr-only"
            >
              아고라 사이드바
            </h2>
            <p id="sidebar-description" className="sr-only">
              토론에 참여한 사용자를 확인할 수 있으며 특정 사용자를 강퇴하도록
              투표할 수 있습니다.
            </p>
            <button
              type="button"
              className="absolute top-1rem right-1rem"
              aria-label="사이드바 닫기"
              onClick={toggle}
            >
              <RemoveIcon className="w-22 cursor-pointer" />
            </button>
            <ChatSideModule title="아고라 설정">
              {enterAgora.isCreator ? (
                <div className="flex-1 w-full relative">
                  <ModifyAgoraImage />
                </div>
              ) : (
                <div className="flex-1 w-full relative">
                  {isValidImgUrl(enterAgora.imageUrl) ? (
                    <div className="relative w-60 h-60">
                      <Image
                        src={enterAgora.imageUrl}
                        alt="아고라 프로필"
                        layout="fill"
                        objectFit="cover"
                        className="rounded-3xl under-mobile:rounded-2xl"
                      />
                    </div>
                  ) : (
                    <div
                      className={`w-60 h-60 rounded-3xl under-mobile:rounded-2xl ${enterAgora.agoraColor}`}
                    />
                  )}
                </div>
              )}
            </ChatSideModule>
            {enterAgora.status !== AGORA_STATUS.CLOSED && (
              <ChatSideModule title="참여자 목록">
                <Suspense fallback={<AgoraUserSideSkeleton />}>
                  <AgoraUserSuspense agoraId={enterAgora.id} />
                </Suspense>
              </ChatSideModule>
            )}
          </main>
        </div>
      </div>
    </section>
  );
}
