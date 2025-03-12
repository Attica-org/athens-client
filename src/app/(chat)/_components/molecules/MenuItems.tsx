import React from 'react';
import ShareButton from '../atoms/ShareButton';
import HamburgerButton from '../atoms/HamburgerButton';

type Props = {
  memoizedTitle: string;
  toggle: () => void;
  refetchAgoraUserList: () => void;
  isClosed: boolean;
};

function MenuItems({
  memoizedTitle,
  toggle,
  refetchAgoraUserList,
  isClosed,
}: Props) {
  return (
    <div className="flex justify-end items-center mr-0.5rem">
      <ShareButton title={memoizedTitle} />
      {!isClosed && (
        <HamburgerButton
          toggleMenu={toggle}
          refetchUserList={refetchAgoraUserList}
        />
      )}
    </div>
  );
}

export default React.memo(MenuItems);
