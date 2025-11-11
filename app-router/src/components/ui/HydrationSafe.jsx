"use client";

import { useEffect, useState } from 'react';

/**
 * HydrationSafe component that prevents hydration mismatches
 * by ensuring consistent rendering between server and client
 */
const HydrationSafe = ({ 
  children, 
  fallback = null,
  className = '',
  style = {}
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return fallback || (
      <div className={className} style={style}>
        {/* Render a placeholder that matches the expected structure */}
      </div>
    );
  }

  return children;
};

export default HydrationSafe;
