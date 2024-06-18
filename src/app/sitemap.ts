import type { MetadataRoute } from 'next';
import getKey from '@/utils/getKey';
import { getAgoraList } from '../lib/getAgoras';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const agoras = await getAgoraList();
  const key = await getKey();

  const urls: MetadataRoute.Sitemap = agoras.map((agora: number) => ({
    url: `${key.BASE_URL}/agoras/${agora}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 1,
  }));

  return [
    {
      url: `${key.BASE_URL}/`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...urls,
  ];
}
