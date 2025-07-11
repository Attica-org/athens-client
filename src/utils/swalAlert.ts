'use client';

import Swal from 'sweetalert2';
import { AccessStatus } from '@/app/model/AccessStatus';
import { TOST_ERROR_MESSAGE } from '@/constants/consts';
import isNull from './validation/validateIsNull';

const focusToTitle = () => {
  const titleEl = Swal.getTitle();
  if (titleEl) {
    titleEl.setAttribute('tabIndex', '-1');
    titleEl.focus();
  }
};

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
  didOpen: focusToTitle,
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
  didOpen: focusToTitle,
});

const swalDeleteAccountClass = Swal.mixin({
  customClass: {
    popup: 'bg-white dark:bg-dark-light-300',
    title: 'text-black dark:text-white text-lg',
    confirmButton: 'text-sm',
    cancelButton: 'text-sm',
    validationMessage: 'bg-white dark:bg-dark-light-300 text-xs',
    input: 'text-black dark:text-white bg-white dark:bg-dark-light-300',
  },
});

const swalDeleteAccountSuccessAlertClass = Swal.mixin({
  customClass: {
    popup: 'bg-white dark:bg-dark-light-300',
    title: 'text-black dark:text-white text-base',
  },
  didOpen: focusToTitle,
});

export const swalBackButtonAlert = async (text: string) => {
  return swalConfirmCancelCustomClass.fire({
    icon: 'warning',
    title: '아고라를 나가시겠습니까?',
    text,
    showCancelButton: true,
    confirmButtonText: '확인',
    cancelButtonText: '취소',
    showCloseButton: false,
    allowEscapeKey: true,
    focusCancel: false,
    focusConfirm: false,
    width: '250px',
    confirmButtonColor: '#10AE5D',
    cancelButtonColor: '#F2F4F3',
  });
};

export const swalShowErrorAlert = async (type: AccessStatus) => {
  return swalConfirmAlertCustomClass.fire({
    icon: 'warning',
    title: TOST_ERROR_MESSAGE[type].TITLE,
    text: TOST_ERROR_MESSAGE[type].TEXT,
    confirmButtonText: '확인',
    focusConfirm: false,
    width: '250px',
    confirmButtonColor: '#10AE5D',
  });
};

export const swalDeleteAccountConfirm = async () => {
  return swalDeleteAccountClass.fire({
    width: '300px',
    title: 'Athens 탈퇴',
    input: 'checkbox',
    inputPlaceholder: `
      Athens 탈퇴에 동의합니다.
    `,
    confirmButtonText: '탈퇴',
    confirmButtonColor: '#10AE5D',
    cancelButtonText: '취소',
    showCancelButton: true,
    focusCancel: true,
    inputValidator: (result) => {
      if (!result) {
        return '탈퇴에 동의해야 합니다.';
      }

      return null;
    },
  });
};

let timerInterval: ReturnType<typeof setInterval>;

export const swalDeleteAccountSuccessAlert = async () => {
  return swalDeleteAccountSuccessAlertClass.fire({
    width: '300px',
    title: '계정을 삭제 하는 중입니다..',
    html: '<b></b> 초 뒤에 로그인 화면으로 이동합니다.',
    timer: 5000,
    timerProgressBar: true,
    didOpen: () => {
      Swal.showLoading();
      const timer = Swal.getPopup()?.querySelector('b');

      if (!isNull(timer)) {
        timerInterval = setInterval(() => {
          const timerLeft = Swal.getTimerLeft();

          if (!isNull(timerLeft)) {
            timer!.textContent = `${Math.floor(timerLeft / 1000)}`;
          }
        }, 100);
      }
    },
    willClose: () => {
      clearInterval(timerInterval);
    },
  });
};
