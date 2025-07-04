import { AgoraTabStatus, SearchParams } from '@/app/model/Agora';
import { AGORACATEGORY } from '@/constants/consts';
import { getCategoryAgoraListBasicQueryKey } from '@/constants/queryKey';
import { QueryClient } from '@tanstack/query-core';

type OptionsArg = {
  searchParams: SearchParams;
  status: AgoraTabStatus;
  category: keyof typeof AGORACATEGORY;
};

export const useCategoryAgoraRefetch = (queryClient: QueryClient) => {
  const getOptions = ({ searchParams, status, category }: OptionsArg) => {
    return {
      queryKey: [
        'agoras',
        'search',
        'category',
        { ...searchParams, status, category },
      ],
      exact: false,
    };
  };

  const handleActiveAgoraRefreshBtn = async ({
    searchParams,
    status,
    category,
  }: OptionsArg) => {
    const options = getOptions({ searchParams, status, category });

    await queryClient.invalidateQueries(options);
    await queryClient.refetchQueries(options);
  };

  const refetchAgoraList = async ({
    searchParams,
    status,
    category,
  }: OptionsArg) => {
    const options = getOptions({ searchParams, status, category });
    await queryClient.resetQueries({
      queryKey: getCategoryAgoraListBasicQueryKey(),
    });
    await queryClient.invalidateQueries(options);
  };

  return {
    handleActiveAgoraRefreshBtn,
    refetchAgoraList,
  };
};
