import Swal from 'sweetalert2';
import { useEffect } from 'react';

export default function KickedUserAlert() {
  const notification = Swal.mixin({
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
  useEffect(() => {
    notification.fire({
      icon: 'warning',
      title: '추방당하셨습니다.',
      text: '과반수 이상의 참여자가 추방에 동의했습니다.',
      confirmButtonText: '확인',
    });
  }, []);
  return null;
}
