import { useEffect } from 'react';

/**
 * useZoomLock Hook
 * 1. Prevents user zoom keyboard and wheel shortcuts (Ctrl/Cmd + '+', '-', '0', mousewheel zoom, gesture zoom).
 * 2. Dynamically calculates browser zoom level and applies scale compensation
 *    so all UI components remain at 100% visual size regardless of browser zoom settings.
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

    // 4. Calculate baseline devicePixelRatio for 100% browser zoom
    const initialDPR = window.devicePixelRatio || 1;
    let initialRatio = 1;
    if (window.outerWidth && window.innerWidth) {
      initialRatio = window.outerWidth / window.innerWidth;
    }

    let baseDPR = initialDPR;
    // If browser opened already zoomed (outerWidth / innerWidth is not ~1.0)
    if (Math.abs(initialRatio - 1) > 0.08) {
      baseDPR = initialDPR / initialRatio;
    }

    const updateZoomCompensation = () => {
      const currentDPR = window.devicePixelRatio || 1;
      let calculatedZoom = currentDPR / baseDPR;

      // Double-check with window.outerWidth / window.innerWidth if available
      if (window.outerWidth && window.innerWidth) {
        const windowRatio = window.outerWidth / window.innerWidth;
        if (Math.abs(calculatedZoom - windowRatio) > 0.25) {
          calculatedZoom = windowRatio;
        }
      }

      // Clamp calculated zoom factor between 0.5 and 3.0
      if (calculatedZoom < 0.5) calculatedZoom = 0.5;
      if (calculatedZoom > 3) calculatedZoom = 3;

      // Inverse scale factor to maintain 100% visual component sizes
      const inverseScale = 1 / calculatedZoom;

      // Apply CSS zoom property to document root and body
      if (document.documentElement) {
        document.documentElement.style.zoom = inverseScale;
      }
      if (document.body) {
        document.body.style.zoom = inverseScale;
      }
    };

    // Execute immediately
    updateZoomCompensation();

    // Listen to resize and orientation changes
    window.addEventListener('resize', updateZoomCompensation);
    window.addEventListener('orientationchange', updateZoomCompensation);

    // Poll periodically to catch browser menu zoom changes that might not emit resize immediately
    const intervalId = setInterval(updateZoomCompensation, 400);

    return () => {
      window.removeEventListener('keydown', handleKeyDown, { capture: true });
      window.removeEventListener('wheel', handleWheel, { capture: true });
      document.removeEventListener('gesturestart', handleGesture, { capture: true });
      document.removeEventListener('gesturechange', handleGesture, { capture: true });
      window.removeEventListener('resize', updateZoomCompensation);
      window.removeEventListener('orientationchange', updateZoomCompensation);
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
