import Swal from 'sweetalert2';

export const swalConfirmCancelAlert = Swal.mixin({
  customClass: {
    icon: 'text-xxxs',
    popup:
      'w-[250px] h-[170px] bg-white dark:bg-dark-light-300 place-self-center rounded-xl', // 전체 모달 관리
    title: 'p-0 text-sm mt-8 text-black dark:text-[#E2E2E2]',
    container: 'text-black dark:text-[#E2E2E2]',
    confirmButton:
      'bg-backbutton-confirm w-80 h-27 text-xs text-white rounded-md',
    cancelButton: 'bg-backbutton-cancel ml-7 w-80 h-27 text-xs rounded-md',
  },
  buttonsStyling: false,
});

export const swalConfirmAlert = Swal.mixin({
  customClass: {
    icon: 'text-xxxs',
    popup:
      'w-[250px] h-[170px] bg-white dark:bg-dark-light-300 place-self-center rounded-xl', // 전체 모달 관리
    title: 'p-0 text-sm mt-8 text-black dark:text-[#E2E2E2]',
    container: 'text-black dark:text-[#E2E2E2]',
    confirmButton:
      'bg-backbutton-confirm w-80 h-27 text-xs text-white rounded-md',
  },
  buttonsStyling: false,
});
