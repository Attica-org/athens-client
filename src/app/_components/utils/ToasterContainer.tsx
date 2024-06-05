'use client';

import React, { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';

export default function ToasterContainer() {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  return hasMounted ? (
    <Toaster />
  ) : null;
}
