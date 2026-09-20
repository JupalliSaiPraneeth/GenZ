import { useEffect } from 'react';

/**
 * useZoomLock Hook
 * Resets document zoom to standard native 100% and allows full native browser zoom & pinch gestures.
 */
export function useZoomLock() {
  useEffect(() => {
    // Ensure document root and body use standard 1:1 scale and permit native browser zooming
    if (document.documentElement) {
      document.documentElement.style.zoom = '1';
    }
    if (document.body) {
      document.body.style.zoom = '1';
    }
  }, []);
}
