import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/lib',
    },
    sitemap: `${process.env.NEXT_PUBLIC_CLIENT_URL}/sitemap.xml`,
  };
}
