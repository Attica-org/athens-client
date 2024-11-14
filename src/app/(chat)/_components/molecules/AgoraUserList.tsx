import React from 'react';
import { ParticipationPosition } from '@/app/model/Agora';
import { AGORA_POSITION } from '@/constants/agora';
import { PROFLELIST } from '@/constants/consts';
import UserImage from '../../../_components/atoms/UserImage';

type UserList = {
  id: number;
  nickname: string;
  photoNumber: number;
  type: ParticipationPosition;
};

type Props = {
  position: ParticipationPosition;
  userList: UserList[];
};

export default function AgoraUserList({ position, userList }: Props) {
  const handleKick = () => {
    alert('추방하기 확인');
  };
  return (
    <div className="pb-0.5rem">
      <h3
        aria-label={
          position === AGORA_POSITION.PROS
            ? '찬성측 참여자 목록'
            : '반대측 참여자 목록'
        }
        id={position}
        className="text-sm pb-10 lg:pb-1rem dark:text-white dark:text-opacity-85"
      >
        {position === AGORA_POSITION.PROS ? '찬성측' : '반대측'}
      </h3>
      <ul
        aria-labelledby={position}
        className="flex flex-col justify-center items-start"
      >
        {userList.map(
          (user) =>
            user.type !== AGORA_POSITION.OBSERVER &&
            user.type === position && (
              <li
                className="w-full flex justify-between items-center pb-1rem"
                key={user.id}
              >
                <div className="flex items-center">
                  <UserImage
                    aria-hidden
                    className="w-40 h-40 bg-white"
                    file={
                      user.photoNumber
                        ? PROFLELIST[user.photoNumber - 1].file
                        : PROFLELIST[0].file
                    }
                    name={user.nickname}
                    w={40}
                    h={40}
                  />
                  <div className="ml-0.5rem text-sm dark:text-white dark:text-opacity-85">
                    {user.nickname}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleKick}
                  className="w-70 h-24 text-xs bg-red-500 text-white rounded-md"
                >
                  추방하기
                </button>
              </li>
            ),
        )}
      </ul>
    </div>
  );
}
