import React from 'react';
import Borderline from '../atoms/Borderline';

import AccountInfos from '../molecules/AccountInfos';
import { ActionButtons } from '../molecules/ActionButtons';

export default function Main() {
  return (
    <main>
      <AccountInfos className="px-24 py-14" />
      <Borderline className="mt-10 mb-10" />
      <ActionButtons className="px-24 py-14 flex flex-col items-start" />
    </main>
  );
}
