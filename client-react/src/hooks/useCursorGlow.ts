import { useEffect, useRef } from 'react';

export function useCursorGlow<T extends HTMLElement>() {
  const containerRef = useRef<T>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    function handleMove(e: MouseEvent) {
      container!.style.setProperty('--cursor-x', `${e.clientX}px`);
      container!.style.setProperty('--cursor-y', `${e.clientY}px`);
      container!.style.setProperty('--glow-opacity', '1');
    }

    function hide() {
      container!.style.setProperty('--glow-opacity', '0');
    }

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseleave', hide);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseleave', hide);
    };
  }, []);

  return containerRef;
}
