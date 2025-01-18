import NotificationIcon from '@/assets/icons/NotificationIcon';
import React from 'react';
import AgoraPointColorList from '@/app/(main)/_components/molecules/SelectAgoraColor';
import ParticipantCapacitySetter from '../_components/molecules/ParticipantCapacitySetter';
import DiscussionDurationSetter from '../_components/molecules/DiscussionDurationSetter';
import AgoraTitleInput from './_component/AgoraTitleInput';
import CreateAgoraBtn from './_component/CreateAgoraBtn';
import CategoryButtonContainer from '../_components/organisms/CategoryButtonContainer';
import CreateAgoraImageUpload from './_component/CreateAgoraImageUpload';

export async function generateMetadata() {
  return {
    title: '아고라 생성 - Athens',
    description: '사람들과 이야기하고 싶은 주제로 아고라를 만들어보세요.',
    openGraph: {
      title: '아고라 생성 - Athens',
      description: '사람들과 이야기하고 싶은 주제로 아고라를 만들어보세요.',
      type: 'website',
      images: [
        {
          url: `${process.env.NEXT_PUBLIC_CLIENT_URL}/opengraph.logo.png`,
          width: 1200,
          height: 630,
          alt: 'Athens 로고',
        },
      ],
    },
  };
}

export default function Page() {
  return (
    <section className="overflow-y-scroll scrollbar-hide flex flex-col pb-70 lg:pb-25 flex-1 h-dvh min-w-270 flex-grow">
      <main className="flex h-dvh flex-1 flex-grow min-w-270 justify-between items-stretch py-0 px-1rem under-mobile:pl-1rem under-mobile:pr-1rem flex-col">
        <div className="flex flex-col w-full under-mobile:mt-10 dark:text-white dark:text-opacity-85">
          <div className="flex justify-around flex-col w-full">
            <section>
              <AgoraTitleInput />
            </section>
            <section className="mt-2rem w-full">
              <div
                role="region"
                className="text-sm lg:text-md mb-10 under-mobile:text-sm"
              >
                아고라 프로필 이미지
              </div>
              <CreateAgoraImageUpload />
            </section>
            <section className="mt-2rem w-full">
              <div
                role="region"
                className="text-sm lg:text-md mb-10 under-mobile:text-sm"
              >
                아고라 카테고리 분류
              </div>
              <CategoryButtonContainer />
            </section>
            <section className="mt-2rem w-full">
              <div
                role="region"
                className="text-sm lg:text-md mb-10 under-mobile:text-sm"
              >
                포인트 색상
              </div>
              <AgoraPointColorList />
              <div className="flex justify-start items-center mt-12">
                <NotificationIcon className="w-1rem mr-0.5rem" />
                <div className="text-xs text-athens-gray-thick break-keep dark:text-white dark:text-opacity-65">
                  이미지와 색상 모두 설정할 시 이미지가 우선적으로 보여집니다.
                </div>
              </div>
            </section>
            <section className="mt-2rem w-full">
              <div
                role="region"
                className="mb-10 text-sm lg:text-md under-mobile:text-sm"
              >
                최대 참여 인원
              </div>
              <ParticipantCapacitySetter />
              <div className="flex justify-start items-center mt-5">
                <NotificationIcon className="w-1rem mr-0.5rem" />
                <div className="text-xs text-athens-gray-thick break-keep dark:text-white dark:text-opacity-65">
                  관찰자는 인원 제한없이 참여할 수 있습니다.
                </div>
              </div>
            </section>
            <section className="mt-2rem w-full">
              <div role="region" className="mb-10 text-sm lg:text-md">
                토론 제한시간
              </div>
              <DiscussionDurationSetter />
            </section>
          </div>
        </div>
        <CreateAgoraBtn />
      </main>
    </section>
  );
}
