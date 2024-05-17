import React from 'react';

type Props = {
  title: string;
  desc: string;
  children?: React.ReactNode;
};

function PageTitle({ title, desc, children = null }: Props) {
  return (
    <>
      <h1
        aria-label="페이지 제목"
        className="text-xl font-bold w-full flex justify-start items-center dark:text-white"
      >
        {title}
      </h1>
      <div className="flex justify-between items-center break-words">
        <p className="under-mobile:mt-0.5rem under-mobile:mb-0 mt-1rem text-sm text-gray-700 mb-1rem break-keep dark:text-white dark:text-opacity-85">
          {desc}
        </p>
        {children}
      </div>
    </>
  );
}

export default React.memo(PageTitle);
