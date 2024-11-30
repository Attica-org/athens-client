'use client';

import React from 'react';

import SelectedProfile from './SelectedProfile';
import SelectProfile from './SelectProfile';

export default function SetUserProfile() {
  return (
    <div className="flex flex-col justiy-start items-center">
      <SelectedProfile />
      <SelectProfile />
    </div>
  );
}
