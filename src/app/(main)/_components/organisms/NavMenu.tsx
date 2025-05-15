import React from 'react';
import MobileNav from '../templates/MobileNav';
import DesktopNav from '../templates/DesktopNav';
import RouteAnnouncer from '../atoms/RouteAnnouncer';

function SideNav() {
  return (
    <nav className="lg:h-dvh flex-1 max-w-12rem flex-grow">
      <RouteAnnouncer />
      <DesktopNav />
      <MobileNav />
    </nav>
  );
}

export default SideNav;
