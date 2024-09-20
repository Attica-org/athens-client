import type { Metadata, Viewport } from 'next';
import React from 'react';
import './globals.css';
import { Noto_Sans_KR } from 'next/font/google';
import Script from 'next/script';
import MSWComponent from './config/MSWComponent';
import RQProvider from './config/RQProvider';
import ServiceWorkerRegistration from './config/ServiceWorkerRegistration';
import ToasterContainer from './config/ToasterContainer';
import SetTheme from './_components/utils/SetTheme';

export const viewport: Viewport = {
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
  variable: '--noto_sans_kr',
});

declare global {
  interface Window {
    Kakao: any;
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="dark">
      <link rel="manifest" href="/manifest.json" />
      <body
        className={`h-dvh inset-y-full under-large:w-full min-w-300 lg:flex scrollbar-hide overflow-x-hidden overflow-y-hidden justify-center items-start w-full dark:bg-dark-bg-light ${noto.className} antialiased`}
      >
        <MSWComponent />
        <ServiceWorkerRegistration />
        <RQProvider>
          <SetTheme />
          {children}
          <ToasterContainer />
        </RQProvider>
      </body>
      <Script
        src="https://developers.kakao.com/sdk/js/kakao.js"
        strategy="afterInteractive"
      />
    </html>
  );
}
