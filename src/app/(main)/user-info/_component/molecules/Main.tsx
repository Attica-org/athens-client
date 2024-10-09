import React from 'react';
import Borderline from '../atoms/Borderline';
import AccountInfo from '../atoms/AccountInfo';
import ActionButton from '../atoms/ActionButton';

export default function Main() {
  return (
    <main>
      <section className="px-24 py-14">
        <div className="text-md font-bold mb-20 dark:text-white">내 정보</div>
        <AccountInfo
          label="이메일"
          content="dkanrjskgo1234567891234567889@dobby.com"
          className="mb-10"
        />
        <AccountInfo label="소셜로그인" content="카카오" />
      </section>

      <Borderline className="mt-10 mb-10" />

      <section className="px-24 py-14 flex flex-col items-start">
        <ActionButton
          label="로그아웃"
          className="text-sm mb-14 text-gray-500 dark:text-gray-300"
        />
        <ActionButton
          label="Athens 탈퇴"
          className="text-sm text-gray-500 dark:text-gray-300"
        />
      </section>
    </main>
  );
}
