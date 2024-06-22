import React from 'react';

function CategoryButton() {
  return (
    <div className="bg-opacity-50 skeleton bg-athens-gray dark:bg-dark-bg-light dark:border-1 dark:border-gray-500 p-16 pl-38 pr-38 rounded-full mr-7" />
  );
}

export default function CategoryButtonListSkeleton() {
  return (
    <div className="mt-10 mb-0 pb-0 pl-0.5rem pr-0.5rem flex overflow-hidden ml-5">
      <CategoryButton />
      <CategoryButton />
      <CategoryButton />
    </div>
  );
}
