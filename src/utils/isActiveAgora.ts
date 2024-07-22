import { AgoraData, Agora as IAgora } from '@/app/model/Agora';

export default function isAgoraActive(agora: AgoraData): agora is IAgora {
  return (agora as IAgora).participants !== undefined;
}
