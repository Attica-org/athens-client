import { UnionAgora } from '@/app/model/Agora';
import { isActiveAgora } from '@/utils/validation/validateAgora';

export function getAgoraIntroduceString(agora: UnionAgora) {
  return `${agora.agoraTitle}. 아고라 세부 정보를 들으시려면 엔터키를 누르세요.`;
}

export function getAgoraDetailString(agora: UnionAgora) {
  let baseStr = '';

  if (isActiveAgora(agora)) {
    const { pros, cons, observer } = agora.participants;
    baseStr += `현재 찬성자는 ${pros}명, 반대자는 ${cons}명, 관찰자는 ${observer} 명입니다.`;
  } else {
    const { prosCount, consCount, totalMember } = agora;
    const prosWidth =
      prosCount <= 0 ? 0 : Math.floor((prosCount / totalMember) * 100);
    const consWidth =
      consCount <= 0 ? 0 : Math.floor((consCount / totalMember) * 100);

    baseStr += `토론에 참여했던 인원은 ${totalMember}명이며, 찬성 ${prosWidth}%, 반대 ${consWidth}% 로 종료되었습니다.`;
  }

  baseStr += '입장하시겠습니까?';

  return baseStr;
}
