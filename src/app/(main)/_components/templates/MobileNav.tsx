import React from 'react';
import NavLinks from '../molecules/NavLinks';

function MobileNav() {
  return (
    <div className="block lg:hidden w-full min-w-300 fixed bottom-0rem bg-white z-10 dark:bg-dark-light-300">
      <div className="w-lg flex flex-row justify-center items-center">
        <NavLinks />
      </div>
    </div>
  );
}

export default MobileNav;
