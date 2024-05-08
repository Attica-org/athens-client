import type { Metadata, Viewport } from 'next';
import React from 'react';
import './globals.css';
import MSWComponent from './_components/utils/MSWComponent';
import RQProvider from './_components/utils/RQProvider';

export const viewport:Viewport = {
  themeColor: '#3A3A3B',
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  title: 'Athens',
  description: 'Athens | 실시간 익명 채팅으로 광장에서 자유롭게 토론하세요.',
  manifest: '/manifest.json',
  icons: [
    { rel: 'icon', url: '/img/icons/icon-192x192.png', sizes: '192x192' },
    { rel: 'icon', url: '/img/icons/icon-256x256.png', sizes: '256x256' },
    { rel: 'icon', url: '/img/icons/icon-384x384.png', sizes: '384x384' },
    { rel: 'icon', url: '/img/icons/icon-512x512.png', sizes: '512x512' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="dark">
      <link rel="manifest" href="/manifest.json" />
      <body className="lg:flex scrollbar-hide overflow-x-hidden justify-center items-start w-full dark:bg-dark-bg-light">
        <MSWComponent />
        <RQProvider>
          {children}
        </RQProvider>
      </body>
    </html>
  );
}
