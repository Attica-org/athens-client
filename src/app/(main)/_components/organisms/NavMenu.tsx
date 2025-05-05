import React from 'react';
import MobileNav from '../templates/MobileNav';
import DesktopNav from '../templates/DesktopNav';

function SideNav() {
  return (
    <nav className="lg:h-dvh flex-1 max-w-12rem flex-grow">
      <p className="sr-only" role="status">
        해당 페이지에서 아고라를 검색하거나 입장할 수 있습니다.
      </p>
      <DesktopNav />
      <MobileNav />
    </nav>
  );
}

export default SideNav;
