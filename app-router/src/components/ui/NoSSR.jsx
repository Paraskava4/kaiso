"use client";

import { useEffect, useState } from 'react';

/**
 * NoSSR component that prevents server-side rendering
 * Useful for components that use browser-specific APIs
 */
const NoSSR = ({ children, fallback = null }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return fallback;
  }

  return children;
};

export default NoSSR;
