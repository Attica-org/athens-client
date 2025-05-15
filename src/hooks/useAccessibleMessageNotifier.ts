import { Status } from '@/app/model/Agora';
import { Message as IMessage } from '@/app/model/Message';
import { AGORA_POSITION, AGORA_STATUS } from '@/constants/agora';
import isNull from '@/utils/validation/validateIsNull';
import { useEffect, useRef, useState } from 'react';

export function useAccessibleMessageNotifier(
  newMessages: IMessage[],
  agoraStatus: Status | '',
) {
  const [ariaMessage, setAriaMessage] = useState<string>('');
  const messageQueue = useRef<IMessage[]>([]);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const userType = (type: IMessage['user']['type']) => {
    if (type === AGORA_POSITION.PROS) return '찬성측';
    return '반대측';
  };

  useEffect(() => {
    if (newMessages.length === 0 || agoraStatus === AGORA_STATUS.CLOSED) return;

    // 새 메시지를 큐에 저장
    messageQueue.current.push(...newMessages);

    // 타이머가 이미 작동 중이면 새로 설정하지 않음 (debounce)
    if (!isNull(timeoutRef.current)) return;
    setAriaMessage('');

    timeoutRef.current = setTimeout(() => {
      const queued = [...messageQueue.current];
      messageQueue.current = [];
      timeoutRef.current = null;

      if (queued.length === 1) {
        const msg = queued[0];
        setAriaMessage(
          `${userType(msg.user.type)} ${msg.user.nickname} 님이 메시지를 보냈습니다.`,
        );
      } else {
        setAriaMessage(`새 메시지 ${queued.length}개가 도착했습니다.`);
      }
    }, 2000);
  }, [newMessages]);

  return ariaMessage;
}
