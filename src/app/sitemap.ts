import type { MetadataRoute } from 'next';
import { getAgoraList } from '../lib/getAgoras';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const agoras = await getAgoraList();

  const urls: MetadataRoute.Sitemap = agoras.map((agora: number) => ({
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/agoras/${agora}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 1,
  }));

  return [
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...urls,
  ];
}
