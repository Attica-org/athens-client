import React, { forwardRef } from 'react';

export default forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  function CustomList(props, ref) {
    return (
      <div className="flex flex-1 flex-col p-5 pt-3 pb-5rem justify-start items-center">
        <div
          {...props}
          ref={ref} // 전달된 ref를 내부 div에 연결
          className="grid gap-x-1rem gap-y-1rem 
                     under-mobile:grid-cols-2 
                     mobile:grid-cols-2 
                     foldable:grid-cols-3 
                     tablet:grid-cols-4 
                     under-tablet:grid-cols-4 
                     sm:grid-cols-3 
                     lg:grid-cols-5 
                     under-large:grid-cols-5 
                     under-xl:grid-cols-4 
                     xl:grid-cols-6"
        />
      </div>
    );
  },
);
