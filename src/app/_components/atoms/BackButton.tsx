import BackIcon from '@/assets/icons/BackIcon';
import React from 'react';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';

export default function BackButton() {
  const swalButton = Swal.mixin({
    customClass: {
      icon: 'text-xxxs',
      popup:
        'w-[250px] h-[170px] bg-white dark:bg-dark-light-300 place-self-center', // 전체 모달 관리
      title: 'p-0 text-sm mt-8 text-black dark:text-[#E2E2E2]',
      container: 'text-black dark:text-[#E2E2E2]',
      confirmButton:
        'bg-backbutton-confirm w-80 h-27 text-xs text-white rounded-md',
      cancelButton: 'bg-backbutton-cancel ml-7 w-80 h-27 text-xs rounded-md',
    },
    buttonsStyling: false,
  });

  const router = useRouter();

  const handleBack = () => {
    swalButton
      .fire({
        icon: 'warning',
        title: '아고라를 나가시겠습니까?',
        text: '설정한 프로필은 초기화됩니다.',
        showCancelButton: true,
        confirmButtonText: '확인',
        cancelButtonText: '취소',
      })
      .then((result) => {
        if (result.isConfirmed) {
          router.replace('/home');
        }
      });
  };
  return (
    <button aria-label="뒤로가기" type="button" onClick={handleBack}>
      <BackIcon className="w-22 ml-1rem cursor-pointer" />
    </button>
  );
}
