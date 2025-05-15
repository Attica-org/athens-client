import React from 'react';
import ShareButton from '../atoms/ShareButton';
import HamburgerButton from '../atoms/HamburgerButton';

type Props = {
  memoizedTitle: string;
  refetchAgoraUserList: () => void;
  isClosed: boolean;
};

function MenuItems({ memoizedTitle, refetchAgoraUserList, isClosed }: Props) {
  return (
    <div className="flex justify-end items-center mr-0.5rem">
      <ShareButton title={memoizedTitle} />
      {!isClosed && <HamburgerButton refetchUserList={refetchAgoraUserList} />}
    </div>
  );
}

export default React.memo(MenuItems);
