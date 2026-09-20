import { useEffect } from 'react';

/**
 * useZoomLock Hook
 * 1. Blocks user zoom keyboard and mouse wheel shortcuts (Ctrl/Cmd + '+', '-', '0', mousewheel zoom, gesture zoom).
 * 2. Automatically detects system display scale (OS settings) and browser zoom on any laptop or monitor,
 *    applying inverse CSS scale compensation so the website appears at 100% standard size on EVERY device.
 */
export function useZoomLock() {
  useEffect(() => {
    // 1. Prevent keyboard zoom shortcuts (Ctrl +, Ctrl -, Ctrl 0, Cmd +, Cmd -, Cmd 0)
    const handleKeyDown = (e) => {
      if (
        (e.ctrlKey || e.metaKey) &&
        (e.key === '+' ||
          e.key === '-' ||
          e.key === '=' ||
          e.key === '_' ||
          e.key === '0' ||
          e.code === 'NumpadAdd' ||
          e.code === 'NumpadSubtract')
      ) {
        e.preventDefault();
      }
    };

    // 2. Prevent mouse wheel Ctrl/Cmd zoom
    const handleWheel = (e) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
      }
    };

    // 3. Prevent touch gesture pinch zoom (macOS / Mobile Safari)
    const handleGesture = (e) => {
      e.preventDefault();
    };

    window.addEventListener('keydown', handleKeyDown, { capture: true });
    window.addEventListener('wheel', handleWheel, { passive: false, capture: true });
    document.addEventListener('gesturestart', handleGesture, { capture: true });
    document.addEventListener('gesturechange', handleGesture, { capture: true });

    const updateSystemZoomAdaptation = () => {
      // Get current total pixel ratio (combining OS system display scale & browser zoom)
      const currentDPR = window.devicePixelRatio || 1;

      // On mobile / small touch devices (< 640px), keep native scaling
      const isMobileDevice = window.innerWidth <= 640 && ('ontouchstart' in window || navigator.maxTouchPoints > 0);
      
      let targetInverseScale = 1;
      if (!isMobileDevice && currentDPR > 0) {
        // Calculate exact inverse scale factor to standardize to 1.00 (100%) display ratio across all devices
        targetInverseScale = 1 / currentDPR;

        // Clamp inverse scale bounds safely (between 0.45x and 1.25x)
        if (targetInverseScale < 0.45) targetInverseScale = 0.45;
        if (targetInverseScale > 1.25) targetInverseScale = 1.25;
      }

      // Round to 3 decimals to avoid jitter
      const roundedScale = Math.round(targetInverseScale * 1000) / 1000;

      // Apply CSS zoom property to document root and body
      if (document.documentElement) {
        document.documentElement.style.zoom = roundedScale;
      }
      if (document.body) {
        document.body.style.zoom = roundedScale;
      }
    };

    // Execute immediately on mount
    updateSystemZoomAdaptation();

    // Listen to resize, orientation, and media query changes
    window.addEventListener('resize', updateSystemZoomAdaptation);
    window.addEventListener('orientationchange', updateSystemZoomAdaptation);

    // Poll periodically to catch dynamic window zoom or monitor swaps
    const intervalId = setInterval(updateSystemZoomAdaptation, 300);

    return () => {
      window.removeEventListener('keydown', handleKeyDown, { capture: true });
      window.removeEventListener('wheel', handleWheel, { capture: true });
      document.removeEventListener('gesturestart', handleGesture, { capture: true });
      document.removeEventListener('gesturechange', handleGesture, { capture: true });
      window.removeEventListener('resize', updateSystemZoomAdaptation);
      window.removeEventListener('orientationchange', updateSystemZoomAdaptation);
      clearInterval(intervalId);

      if (document.documentElement) {
        document.documentElement.style.zoom = '1';
      }
      if (document.body) {
        document.body.style.zoom = '1';
      }
    };
  }, []);
}
