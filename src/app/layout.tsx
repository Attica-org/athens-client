import type { Metadata, Viewport } from 'next';
import React from 'react';
import './globals.css';
import { Noto_Sans_KR } from 'next/font/google';
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

const noto = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['400', '700'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="dark">
      <link rel="manifest" href="/manifest.json" />
      <body className={`h-dvh inset-y-full under-large:w-full lg:flex scrollbar-hide overflow-x-hidden justify-center items-start w-full dark:bg-dark-bg-light ${noto.className} antialiased`}>
        <MSWComponent />
        <RQProvider>
          {children}
        </RQProvider>
      </body>
    </html>
  );
}
