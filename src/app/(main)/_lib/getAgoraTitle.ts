/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/naming-convention */
import { homeSegmentKey } from '@/constants/segmentKey';
import showToast from '@/utils/showToast';
import { QueryFunction } from '@tanstack/react-query';
import { redirect } from 'next/navigation';
import { getSelectedAgoraQueryKey as getSelectedAgoraTags } from '@/constants/queryKey';
import { callFetchWrapper } from '@/lib/fetchWrapper';
// eslint-disable-next-line import/prefer-default-export
export const getAgoraTitle: QueryFunction<
  { title: string; status: string; imageUrl: string; agoraColor: string },
  [_1: string, _2: string]
> = async ({ queryKey }) => {
  const [_, agoraId] = queryKey;

  const res = await callFetchWrapper(`/api/v1/open/agoras/${agoraId}/title`, {
    next: {
      tags: getSelectedAgoraTags(agoraId),
    },
    credentials: 'include',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (res.success === false) {
    if (res.error.code === 1301) {
      showToast('존재하지 않는 아고라입니다.', 'error');
    } else {
      showToast('아고라 제목을 불러오는데 실패했습니다.', 'error');
    }

    redirect(`${homeSegmentKey}?status=active`);
  }

  const result = res.response;

  return result;
};
