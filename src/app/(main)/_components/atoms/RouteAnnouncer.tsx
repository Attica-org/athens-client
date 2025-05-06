'use client';

import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';

function RouteAnnouncer() {
  const pathname = usePathname();
  const [announcement, setAnnouncement] = useState('');

  useEffect(() => {
    setAnnouncement('');
    const announceTimer = setTimeout(() => {
      let newMessage = '';
      if (pathname === '/home') {
        newMessage = '해당 페이지에서 아고라를 검색하거나 입장할 수 있습니다.';
      } else if (pathname === '/create-agora') {
        newMessage = '해당 페이지에서 아고라를 생성할 수 있습니다.';
      } else if (pathname === '/user-info') {
        newMessage =
          '해당 페이지에서 유저 정보를 확인하거나 조작할 수 있습니다';
      }

      if (newMessage) {
        setAnnouncement(newMessage);
      }
    }, 500);

    return () => clearTimeout(announceTimer);
  }, [pathname]);

  return (
    <>
      {/* 항상 존재하는 정적 컨테이너 */}
      <div className="sr-only" aria-live="assertive">
        {/* 동적으로 변경되는 내용 */}
        {announcement ? <p>{announcement}</p> : null}
      </div>
    </>
  );
}

export default RouteAnnouncer;
