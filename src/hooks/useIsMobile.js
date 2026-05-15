import { useState } from 'react';

/**
 * Returns true when window.innerWidth <= breakpoint (default 640px = mobile)
 * Uses a simple state + resize listener approach.
 */
export function useIsMobile(breakpoint = 640) {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.innerWidth <= breakpoint
  );

  if (typeof window !== 'undefined') {
    const handler = () => setIsMobile(window.innerWidth <= breakpoint);
    window.addEventListener('resize', handler, { passive: true });
  }

  return isMobile;
}
