'use client';

import Swal from 'sweetalert2';

const swalConfirmCancelCustomClass = Swal.mixin({
  customClass: {
    popup:
      'w-[250px] h-[170px] bg-white dark:bg-dark-light-300 place-self-center rounded-xl', // 전체 모달 관리
    title: 'p-0 text-sm mt-8 text-black dark:text-white',
    container: 'text-black dark:text-[#E2E2E2]',
    confirmButton:
      'bg-backbutton-confirm w-100 h-27 text-xs text-white rounded-md',
    cancelButton:
      'bg-backbutton-cancel ml-7 w-100 h-27 text-xs text-black rounded-md',
  },
});

const swalConfirmAlertCustomClass = Swal.mixin({
  customClass: {
    popup:
      'w-[250px] h-[170px] bg-white dark:bg-dark-light-300 place-self-center rounded-xl', // 전체 모달 관리
    title: 'p-0 text-sm mt-8 text-black dark:text-white',
    container: 'text-black dark:text-[#E2E2E2]',
    confirmButton:
      'bg-backbutton-confirm text-white w-100 h-27 text-xs rounded-md mt-[0.6rem] mx-auto mb-0',
    cancelButton: 'bg-[#F2F4F3] dark:bg-white text-black',
  },
});

export const swalBackButtonAlert = async () => {
  return swalConfirmCancelCustomClass.fire({
    icon: 'warning',
    title: '아고라를 나가시겠습니까?',
    text: '설정한 프로필은 초기화됩니다.',
    showCancelButton: true,
    confirmButtonText: '확인',
    cancelButtonText: '취소',
    width: '250px',
    confirmButtonColor: '#10AE5D',
    cancelButtonColor: '#F2F4F3',
  });
};

export const swalKickedUserAlert = async () => {
  return swalConfirmAlertCustomClass.fire({
    icon: 'warning',
    title: '추방당하셨습니다.',
    text: '과반수 이상의 참여자가 추방에 동의했습니다.',
    confirmButtonText: '확인',
    width: '250px',
    confirmButtonColor: '#10AE5D',
  });
};
