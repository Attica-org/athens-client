import { SearchParams } from '@/app/model/Agora';
import RefreshIcon from '@/assets/icons/RefreshIcon';
import { useCreateAgora } from '@/store/create';
import { useSearchStore } from '@/store/search';
import { useQueryClient } from '@tanstack/react-query';
import React, { useCallback } from 'react';
import { useShallow } from 'zustand/react/shallow';

type Props = {
  searchParams: SearchParams;
};

function CategoryAgoraNowTitle({ searchParams }: Props) {
  const queryClient = useQueryClient();
  const { category } = useCreateAgora(
    useShallow((state) => ({
      category: state.category,
    })),
  );

  const { tabStatus } = useSearchStore(
    useShallow((state) => ({
      tabStatus: state.tabStatus,
    })),
  );

  const handleKeyDownRefresh = useCallback(
    async (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        await queryClient.invalidateQueries({
          queryKey: [
            'agoras',
            'search',
            'category',
            { ...searchParams, status: tabStatus, category },
          ],
          exact: false,
        });

        await queryClient.refetchQueries({
          queryKey: [
            'agoras',
            'search',
            'category',
            { ...searchParams, status: tabStatus, category },
          ],
          exact: false,
        });
      }
    },
    [queryClient, tabStatus, category],
  );

  const handleClickRefresh = useCallback(async () => {
    await queryClient.invalidateQueries({
      queryKey: [
        'agoras',
        'search',
        'category',
        { ...searchParams, status: tabStatus, category },
      ],
      exact: false,
    });

    await queryClient.refetchQueries({
      queryKey: [
        'agoras',
        'search',
        'category',
        { ...searchParams, status: tabStatus, category },
      ],
      exact: false,
    });
  }, [queryClient, tabStatus, category]);

  return (
    tabStatus === 'active' && (
      <h2
        aria-label="활성화 상태 아고라"
        className="flex justify-between items-center text-md font-semibold dark:text-dark-line-light text-left pl-10 mb-16 w-full"
      >
        NOW
        <button
          type="button"
          aria-label="활성화 아고라 새로고침"
          onClick={handleClickRefresh}
          onKeyDown={handleKeyDownRefresh}
          className="cursor-pointer flex font-normal mr-5"
        >
          <span className="text-xs mr-5 text-athens-sub font-bold">
            새로고침
          </span>
          <RefreshIcon className="w-16 h-16" />
        </button>
      </h2>
    )
  );
}

export default React.memo(CategoryAgoraNowTitle);
