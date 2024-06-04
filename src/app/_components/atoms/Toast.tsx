'use client';

import errorMessage from '@/utils/errorMessage';
import React, { useEffect, useState } from 'react';

export default function Toast() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const newMessage = errorMessage.getMessage();
    setMessage(newMessage);
    if (!newMessage) {
      return () => {};
    }

    const timer = setTimeout(() => {
      errorMessage.clearMessage();
      setMessage('');
    }, 3000);

    return () => clearTimeout(timer);
  }, [message]);

  if (!message) return null;

  return (
    <div className="text-sm px-16 py-10 rounded-full fixed top-50 left-1/2 transform -translate-x-1/2 bg-toast-bg text-white shadow-lg opacity-90 z-50 transition-opacity duration-500 ease-out">
      {message}
    </div>
  );
}
