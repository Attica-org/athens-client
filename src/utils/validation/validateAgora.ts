import { CategoryAgora, KeywordAgora, UnionAgora } from '@/app/model/Agora';

interface Factor {
  Agora: UnionAgora;
  ActiveAgora: KeywordAgora | CategoryAgora;
}

export function isActiveAgora(
  agora: Factor['Agora'],
): agora is Factor['ActiveAgora'] {
  return (agora as Factor['ActiveAgora']).participants !== undefined;
}

export function isKeywordAgora(agora: Factor['Agora']): agora is KeywordAgora {
  return (agora as KeywordAgora).createdAt !== undefined;
}

export function isCagetoryAgora(
  agora: Factor['Agora'],
): agora is CategoryAgora {
  return isActiveAgora(agora) && !isKeywordAgora(agora);
}
