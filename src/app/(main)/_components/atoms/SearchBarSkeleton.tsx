'use client';

import RemoveIcon from '@/assets/icons/RemoveIcon';
import SearchIcon from '@/assets/icons/SearchIcon';
import React from 'react';

export default function SearchBarSkeleton() {
  return (
    <div className="bg-athens-gray rounded-md p-4 flex justify-center items-center dark:bg-dark-light-300">
      <div>
        <SearchIcon className="w-22 ml-10" />
      </div>
      <div className="w-full">
        <div className="w-full text-sm ml-16 bg-athens-gray border-0 dark:bg-dark-light-300 dark:text-white">
          검색
        </div>
      </div>
      <div className="flex justify-center items-center w-1.5rem h-1.5rem">
        <RemoveIcon className="w-20 cursor-pointer" />
      </div>
    </div>
  );
}
