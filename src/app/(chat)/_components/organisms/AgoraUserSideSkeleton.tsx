import React from 'react';

function UserSkeleton() {
  return (
    <li className="flex justify-start items-center pb-1rem">
      <div className="w-40 h-40 rounded-2xl bg-red-300 bg-opacity-50 skeleton" />
      <div className="ml-0.5rem w-100 h-20 rounded-md bg-dark-line bg-opacity-50 skeleton" />
    </li>
  );
}

export default function AgoraUserSideSkeleton() {
  return (
    <div className="pb-0.5rem">
      <h3 className="text-sm pb-1rem dark:text-white dark:text-opacity-85">
        찬성측
      </h3>
      <ul className="flex flex-col justify-center items-start">
        <UserSkeleton />
        <UserSkeleton />
        <UserSkeleton />
        <UserSkeleton />
      </ul>
      <div className="border-b-1 mt-6 border-gray-200 mb-1rem dark:border-gray-500" />
      <h3 className="text-sm pb-1rem dark:text-white dark:text-opacity-85">
        반대측
      </h3>
      <ul className="flex flex-col justify-center items-start">
        <UserSkeleton />
        <UserSkeleton />
        <UserSkeleton />
        <UserSkeleton />
      </ul>
    </div>
  );
}
