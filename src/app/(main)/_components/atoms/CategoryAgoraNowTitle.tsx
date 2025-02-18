import { SearchParams } from '@/app/model/Agora';
import RefreshIcon from '@/assets/icons/RefreshIcon';
import { getCategoryAgoraListBasicQueryKey } from '@/constants/queryKey';
import { useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import React, { useCallback } from 'react';

type ActiveHeaderProps = {
  tabStatus: string;
  searchParams: SearchParams;
};

function CategoryAgoraNowTitle({ tabStatus, searchParams }: ActiveHeaderProps) {
  const queryClient = useQueryClient();
  const params = useSearchParams();

  const handleKeyDownRefresh = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        queryClient.invalidateQueries({
          queryKey: getCategoryAgoraListBasicQueryKey(),
        });
      }
    },
    [queryClient],
  );

  const handleClickRefresh = async () => {
    const category = params.get('category') ?? '';
    const status = params.get('status') ?? 'active';

    await queryClient.resetQueries({
      queryKey: [
        'agoras',
        'search',
        'category',
        { ...searchParams, status, category },
      ],
      exact: false,
    });

    queryClient.invalidateQueries({
      queryKey: [
        'agoras',
        'search',
        'category',
        { ...searchParams, status, category },
      ],
      exact: false,
    });
  };

  return (
    tabStatus === 'active' && (
      <h2
        aria-label="활성화 상태 아고라"
        className="flex justify-between items-center text-md font-semibold dark:text-dark-line-light text-left pl-10 mb-16 w-full"
      >
        NOW
        <button
          type="button"
          aria-label="활성화 아고라 다시 불러오기"
          onClick={handleClickRefresh}
          onKeyDown={handleKeyDownRefresh}
          className="cursor-pointer flex font-normal mr-5"
        >
          <span className="text-xs mr-5 text-athens-sub font-bold">
            새로고침
          </span>
          <RefreshIcon className="w-16 h-16" fill="#FEAC3E" />
        </button>
      </h2>
    )
  );
}

export default React.memo(CategoryAgoraNowTitle);
