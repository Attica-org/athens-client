import React from 'react';
import PROFLELIST from '@/constants/userProfileImage';
import UserImage from '../../../_components/atoms/UserImage';

type UserList = {
  id: number;
  nickname: string;
  photoNumber: number;
  type: 'PROS' | 'CONS' | 'OBSERVERS';
};

type Props = {
  position: string;
  userList: UserList[];
};

export default function AgoraUserList({ position, userList }: Props) {
  return (
    <div className="pb-0.5rem">
      <h3 id={position} className="text-sm pb-1rem dark:text-white dark:text-opacity-85">
        {position === 'pros' ? '찬성측' : '반대측'}
      </h3>
      <ul
        aria-labelledby={position}
        className="flex flex-col justify-center items-start"
      >
        {userList.map((user) => (
          <li className="flex justify-start items-center pb-1rem" key={user.id}>
            <UserImage
              aria-hidden
              className="w-40 h-40 bg-white"
              file={PROFLELIST[user.photoNumber].file}
              name={user.nickname}
              w={40}
              h={40}
            />
            <div className="ml-0.5rem text-sm dark:text-white dark:text-opacity-85">{user.nickname}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
