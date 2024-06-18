import toast from 'react-hot-toast';

export default function showToast(message: string, type: string) {
  if (type === 'error') {
    toast(message, {
      icon: '❌',
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
  } else if (type === 'success') {
    toast(message, {
      icon: '✅',
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
  }
}
