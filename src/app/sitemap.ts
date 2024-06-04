import type { MetadataRoute } from 'next';
import { getAgoraList } from '../lib/getAgoras';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const agoras = await getAgoraList();

  const urls: MetadataRoute.Sitemap = agoras.map((agora: number) => ({
    url: `http://localhost:3000/agoras/${agora}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 1,
  }));

  return [
    {
      url: 'http://localhost:3000/',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...urls,
  ];
}
