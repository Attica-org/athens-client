'use client';

import RemoveIcon from '@/assets/icons/RemoveIcon';
import React, {
  KeyboardEventHandler,
  MouseEventHandler,
  Suspense,
  useEffect,
} from 'react';
import { useSidebarStore } from '@/store/sidebar';
import { useShallow } from 'zustand/react/shallow';
import { useAgora } from '@/store/agora';
import AgoraImageUpload from '@/app/_components/molecules/AgoraImageUpload';
import AgoraUserSuspense from '../organisms/AgoraUserSuspense';
import AgoraUserSideSkeleton from '../organisms/AgoraUserSideSkeleton';
import ChatSideModule from '../molecules/ChatSideModule';

export default function AgoraSideBar() {
  const { toggle, isOpen } = useSidebarStore(
    useShallow((state) => ({
      toggle: state.toggle,
      isOpen: state.isOpen,
    })),
  );
  const agoraId = useAgora((state) => state.enterAgora.id);

  const onClickOutSide: MouseEventHandler<HTMLDivElement> = (e) => {
    if (e.target === e.currentTarget) {
      toggle();
    }
  };

  const onKeyDownOutSide: KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (e.key === 'Enter' && e.target === e.currentTarget) {
      toggle();
    }
  };

  useEffect(() => {
    const element = document.getElementById('agora-side-bar');
    if (isOpen && element) {
      // 모달이 열릴 때 포커스를 모달로 이동
      element.setAttribute('aria-modal', 'true');
      element.setAttribute('aria-hidden', 'false');
      element.focus();
    }

    if (!isOpen && element) {
      // 모달이 닫힐 때 포커스를 모달 밖으로 이동
      element.setAttribute('aria-modal', 'false');
      element.setAttribute('aria-hidden', 'true');
      element.blur();
    }
  }, [isOpen]);

  const changeAgoraImg = () => {
    // 이미지 변경 서버 요청
  };

  return (
    <div
      role="dialog"
      id="agora-side-bar"
      className={`absolute inset-0 bg-opacity-50 bg-dark-bg-dark duration-500 transition-opacity ${
        !isOpen && 'pointer-events-none opacity-0'
      }`}
      aria-modal={isOpen}
      aria-hidden={!isOpen}
      aria-label="사이드 메뉴 모달"
      tabIndex={-1}
    >
      <div
        onKeyDown={onKeyDownOutSide}
        onClick={onClickOutSide}
        className="w-full h-full"
        role="button"
        tabIndex={0}
        aria-label="아고라 설정 및 참여자 목록"
      >
        <div
          className={`absolute inset-y-0 right-0 flex flex-col max-w-full pl-10 ${
            isOpen ? 'z-15' : 'pointer-events-none'
          }`}
        >
          <section
            role="group"
            className={`relative overflow-y-scroll scrollbar-hide p-1rem right-0 transition duration-500 ease-in-out w-screen inset-y-0 bg-white dark:bg-dark-light-300 flex-1 flex-col h-full border-l-1 border-athens-gray dark:border-dark-light-300 max-w-15rem xl:w-15rem under-mobile:w-[70vw] ${
              isOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
          >
            <button
              type="button"
              className="absolute top-1rem right-1rem"
              aria-label="아이콘으로 사이드 메뉴 닫기"
              onClick={toggle}
            >
              <RemoveIcon className="w-22 cursor-pointer" />
            </button>
            <ChatSideModule title="아고라 설정">
              <div className="flex w-full relative">
                <div className="flex-1">
                  {/* TODO: 전역 상태에 서버로부터 받아온 이미지 저장하여 prop으로 전달 */}
                  <AgoraImageUpload />
                </div>
                {/* TODO: 이미지 수정 했을 때만 저장 버튼 출력하도록 수정 */}
                <button
                  type="button"
                  aria-label="변경한 이미지 저장"
                  onClick={changeAgoraImg}
                  className="z-[-1] absolute left-1/3 bottom-0 text-xs rounded-lg text-athens-sub"
                >
                  저장
                </button>
              </div>
            </ChatSideModule>
            <ChatSideModule title="참여자 목록">
              <Suspense fallback={<AgoraUserSideSkeleton />}>
                <AgoraUserSuspense agoraId={agoraId} />
              </Suspense>
            </ChatSideModule>
          </section>
        </div>
      </div>
    </div>
  );
}
