import React from 'react';

export default function Loading() {
  return (
    <div role="status">
      <div className="p-1rem pb-0 relative min-w-270">
        <h1
          aria-label="페이지 제목"
          className="text-xl font-semibold w-full flex justify-start items-center dark:text-white"
        >
          아고라 검색
        </h1>
        <div className="flex justify-between items-center">
          <div className="flex justify-between items-center break-words">
            <p className="under-mobile:mt-0.5rem under-mobile:mb-0 mt-1rem text-sm text-gray-700 mb-1rem break-keep dark:text-white dark:text-opacity-85">
              토론에 참여하고 싶은 아고라를 선택해주세요.
            </p>
          </div>
          <div className="flex flex-col justify-start items-start p-10">
            <div className="flex items-center text-xxs text-athens-gray-thick whitespace-nowrap dark:text-white">
              <div className="bg-red-400 w-8 h-8 rounded-full mr-10" />
              대기중
            </div>
            <div className="flex items-center text-xxs pt-5 text-athens-gray-thick dark:text-white">
              <div className="bg-athens-button w-8 h-8 rounded-full mr-10" />
              진행중
            </div>
          </div>
        </div>
      </div>
      <div className="justify-center items-stretch flex flex-col h-fit flex-1 relative">
        <div className="bg-white dark:bg-dark-bg-light">
          <div className="pl-1rem pr-1rem pt-8 pb-8">
            <div className="bg-athens-gray rounded-md p-4 flex justify-center items-center dark:bg-dark-light-300">
              <div className="w-full">
                <div
                  className="w-full text-sm bg-athens-gray border-0 focus:outline-none p-5 pl-1rem dark:bg-dark-light-300 dark:text-white"
                >
                  검색
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full pb-0.5rem">
          <div className="flex flex-row justify-around items-center h-2rem w-full text-xs pl-5 pr-5 dark:text-white">
            <div
              className="border-b-1 border-athens-sub flex flex-1 justify-center p-6"
            >
              활성화
            </div>
            <div
              className="flex flex-1 justify-center p-6 border-b-1 dark:border-dark-light-300"
            >
              종료
            </div>
          </div>
        </div>
        <div className="w-full mb-0 pb-0 pl-0.5rem pr-0.5rem flex text-nowrap overflow-hidden ml-5">
          <div className="w-full flex">
            <div
              className="bg-athens-sub text-black border-1 border-athens-sub justify-center p-8 pl-1.5rem pr-1.5rem rounded-full text-xs mr-7"
            >
              전체
            </div>
            <div className="bg-athens-gray dark:bg-dark-bg-light dark:text-white dark:border-1 dark:border-gray-500 rounded-full text-xs p-8 pl-1.5rem pr-1.5rem justify-center mr-7">지식/공부</div>
            <div className="bg-athens-gray dark:bg-dark-bg-light dark:text-white dark:border-1 dark:border-gray-500 rounded-full text-xs p-8 pl-1.5rem pr-1.5rem justify-center mr-7">문화/예술</div>
            <div className="bg-athens-gray dark:bg-dark-bg-light dark:text-white dark:border-1 dark:border-gray-500 rounded-full text-xs p-8 pl-1.5rem pr-1.5rem justify-center mr-7">음식/여행</div>
            <div className="bg-athens-gray dark:bg-dark-bg-light dark:text-white dark:border-1 dark:border-gray-500 rounded-full text-xs p-8 pl-1.5rem pr-1.5rem justify-center mr-7">일상/취미</div>
          </div>
        </div>
      </div>
    </div>

  );
}
