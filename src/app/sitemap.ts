import type { MetadataRoute } from 'next';
import { getAgoraList } from '../lib/getAgoras';

type Agora = {
  id: string;
  updatedAt: string;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const agoras = await getAgoraList();

  const urls: MetadataRoute.Sitemap = agoras.map((agora: Agora) => ({
    url: `http://localhost:3000/agoras/${agora.id}`,
    lastModified: new Date(agora.updatedAt),
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
