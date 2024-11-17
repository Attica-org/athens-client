import { swalConfirmAlert } from '@/utils/swalAlert';
import { useEffect } from 'react';

export default function KickedUserAlert() {
  useEffect(() => {
    swalConfirmAlert.fire({
      icon: 'warning',
      title: '추방당하셨습니다.',
      text: '과반수 이상의 참여자가 추방에 동의했습니다.',
      confirmButtonText: '확인',
      width: '250px',
      confirmButtonColor: 'bg-backbutton-confirm',
    });
  }, []);
  return null;
}
