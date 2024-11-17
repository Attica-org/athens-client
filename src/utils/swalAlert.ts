'use client';

import Swal from 'sweetalert2';

export const swalConfirmCancelAlert = Swal.mixin({
  customClass: {
    popup:
      'w-[250px] h-[170px] bg-white dark:bg-dark-light-300 place-self-center rounded-xl', // 전체 모달 관리
    title: 'p-0 text-sm mt-8 text-black dark:text-white',
    container: 'text-black dark:text-[#E2E2E2]',
    confirmButton:
      'bg-backbutton-confirm w-100 h-27 text-xs text-white  rounded-md',
    cancelButton: 'bg-backbutton-cancel ml-7 w-100 h-27 text-xs rounded-md',
  },
});

export const swalConfirmAlert = Swal.mixin({
  customClass: {
    popup:
      'w-[250px] h-[170px] bg-white dark:bg-dark-light-300 place-self-center rounded-xl', // 전체 모달 관리
    title: 'p-0 text-sm mt-8 text-black dark:text-white',
    container: 'text-black dark:text-[#E2E2E2]',
    confirmButton:
      'bg-backbutton-confirm text-white w-100 h-27 text-xs rounded-md mt-[0.6rem] mx-auto mb-0',
  },
});
