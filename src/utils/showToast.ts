import toast from 'react-hot-toast';

const Toast = (message: string, icon: string) => {
  toast(message, {
    duration: 2000,
    icon,
    ariaProps: {
      role: 'alert',
      'aria-live': 'polite',
    },
    style: {
      borderRadius: '10px',
      background: '#333',
      color: '#fff',
      fontSize: '0.8rem',
    },
  });
};

export default function showToast(message: string, type: string) {
  if (type === 'error') {
    Toast(message, '❌');
  } else if (type === 'success') {
    Toast(message, '✅');
  }
}
