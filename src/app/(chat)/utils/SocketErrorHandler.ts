'use client';

import { AUTHORIZATION_FAIL } from '@/constants/authErrorMessage';
import useUpdateSession from '@/hooks/useUpdateSession';
import { signOutWithCredentials } from '@/serverActions/auth';
import showToast from '@/utils/showToast';
import {
  CHAT_SOCKET_ERROR_MESSAGE,
  REACTION_SOCKET_ERROR_MESSAGE,
} from '@/constants/responseErrorMessage';
import { useRouter } from 'next/navigation';
import { homeSegmentKey } from '@/constants/segmentKey';

const SocketErrorHandler = () => {
  const { callReissueFn } = useUpdateSession();
  const router = useRouter();

  const chatSocketErrorHandler = async (socketError: any) => {
    if (AUTH_MESSAGE.includes(socketError.message)) {
      const reissuResult = await callReissueFn();
      if (reissuResult === AUTHORIZATION_FAIL) {
        showToast(
          '로그인 세션이 만료되었습니다.\n다시 로그인해주세요.',
          'info',
        );
        signOutWithCredentials();
      }
    } else if (socketError.code === 2000) {
      if (socketError.message === CHAT_SOCKET_ERROR_MESSAGE.RUNTIME_EXCEPTION) {
        showToast(
          '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
          'error',
        );
        router.push(homeSegmentKey);
      }
    } else if (socketError.code === 2001) {
      if (socketError.message === CHAT_SOCKET_ERROR_MESSAGE.SOCKET_EXCEPTION) {
        showToast('연결이 불안정합니다. 잠시 후 다시 시도해주세요.', 'error');
        router.push(homeSegmentKey);
      }
    } else if (socketError.code === 1102) {
      if (
        socketError.message ===
        CHAT_SOCKET_ERROR_MESSAGE.OBSERVER_MESSAGE_SEND_ERROR
      ) {
        showToast('관찰자는 메시지를 보낼 수 없습니다.', 'error');
      } else if (
        socketError.message === CHAT_SOCKET_ERROR_MESSAGE.USER_NOT_FOUND
      ) {
        showToast('유저를 찾을 수 없습니다.', 'error');
        router.push(homeSegmentKey);
      } else if (
        socketError.message ===
        REACTION_SOCKET_ERROR_MESSAGE.CHAT_WRITER_CANNOT_REACT_TEMSELVES
      ) {
        showToast(
          '채팅 작성자는 자신의 메시지에 리액션을 보낼 수 없습니다.',
          'error',
        );
      }
    } else if (socketError.code === 1301) {
      if (socketError.message === CHAT_SOCKET_ERROR_MESSAGE.SESSION_NOT_FOUND) {
        showToast('현재 아고라에 존재하지 않는 유저입니다.', 'error');
        router.push(homeSegmentKey);
      } else if (
        socketError.message.startsWith(
          CHAT_SOCKET_ERROR_MESSAGE.NOT_FOUND_AGORA,
        )
      ) {
        showToast('존재하지 않는 아고라입니다.', 'error');
        router.push(homeSegmentKey);
      }
    } else if (
      socketError.message.startsWith(
        REACTION_SOCKET_ERROR_MESSAGE.NOT_FOUND_CHAT,
      )
    ) {
      showToast('존재하지 않는 채팅에 반응을 보낼 수 없습니다.', 'error');
    } else if (socketError.code === 1001) {
      if (
        socketError.message ===
        REACTION_SOCKET_ERROR_MESSAGE.REACTION_TYPE_INVALID
      ) {
        showToast('리액션 타입이 잘못되었습니다.', 'error');
      } else if (
        socketError.message ===
        REACTION_SOCKET_ERROR_MESSAGE.REACTION_TYPE_IS_NULL
      ) {
        showToast('리액션 타입이 비어있습니다.', 'error');
      } else if (
        socketError.message === CHAT_SOCKET_ERROR_MESSAGE.CHAT_TYPE_INVALID
      ) {
        showToast('채팅 타입이 잘못되었습니다.', 'error');
      } else if (
        socketError.message === CHAT_SOCKET_ERROR_MESSAGE.CHAT_TYPE_IS_NULL
      ) {
        showToast('채팅 타입이 비어있습니다.', 'error');
      } else if (
        socketError.message === CHAT_SOCKET_ERROR_MESSAGE.CHAT_MESSAGE_IS_NULL
      ) {
        showToast('메시지를 작성해주세요.', 'error');
      } else if (
        socketError.message === CHAT_SOCKET_ERROR_MESSAGE.CHAT_OVER_LIMIT
      ) {
        showToast('메시지는 최대 10000자 까지만 가능합니다.', 'error');
      }
    } else if (socketError.code === 1002) {
      if (socketError.message === CHAT_SOCKET_ERROR_MESSAGE.AGORA_IS_CLOSED) {
        showToast('종료된 아고라는 채팅을 보낼 수 없습니다.', 'error');
      } else if (
        socketError.message.startsWith(
          CHAT_SOCKET_ERROR_MESSAGE.RECONNECTION_FAILURE,
        )
      ) {
        showToast('재연결 시도에 실패했습니다.', 'error');
        router.push(homeSegmentKey);
      }
    }
  };

  return {
    chatSocketErrorHandler,
  };
};

export default SocketErrorHandler;
