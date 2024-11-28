'use client';

import { SIGNIN_REQUIRED } from '@/constants/authErrorMessage';
import { CHAT_VOTE_ERROR_MESSAGE } from '@/constants/responseErrorMessage';
import showToast from '@/utils/showToast';
import { signOut } from 'next-auth/react';

const ServiceWorkerErrorHandler = () => {
  const voteErrorHandler = async (event: MessageEvent) => {
    if (event.data.message === SIGNIN_REQUIRED) {
      showToast('로그인이 필요합니다.', 'error');
      await signOut({ redirect: true });
    }

    switch (event.data.message.code) {
      case 1301:
        showToast('존재하지 않는 유저 혹은 아고라 입니다.', 'error');
        break;
      case 1002:
        if (
          event.data.message.message === CHAT_VOTE_ERROR_MESSAGE.DUPLICATE_VOTE
        ) {
          showToast('이미 투표하였습니다.', 'error');
        } else {
          showToast('아직 토론이 진행중인 아고라 입니다.', 'error');
        }
        break;
      default:
        showToast(event.data.message, 'error');
    }
  };

  return { voteErrorHandler };
};

export default ServiceWorkerErrorHandler;
