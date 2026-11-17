import { useEffect, useRef } from 'react';

// Keep pointer animation out of React's render loop.
export default function usePointerDepth(strength = 7) {
  const ref = useRef(null);
  useEffect(() => {
    const element = ref.current;
    const media = window.matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
    if (!element) return;
    let frame = 0;
    const reset = () => {
      cancelAnimationFrame(frame);
      ['--rotate-x', '--rotate-y', '--pointer-x', '--pointer-y'].forEach((property) => element.style.removeProperty(property));
    };
    const move = (event) => {
      if (!media.matches || event.pointerType === 'touch') return;
      const bounds = element.getBoundingClientRect();
      const x = Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width));
      const y = Math.max(0, Math.min(1, (event.clientY - bounds.top) / bounds.height));
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        element.style.setProperty('--rotate-x', `${(0.5 - y) * strength}deg`);
        element.style.setProperty('--rotate-y', `${(x - 0.5) * strength}deg`);
        element.style.setProperty('--pointer-x', `${x * 100}%`);
        element.style.setProperty('--pointer-y', `${y * 100}%`);
      });
    };
    element.addEventListener('pointermove', move);
    element.addEventListener('pointerleave', reset);
    element.addEventListener('pointercancel', reset);
    media.addEventListener('change', reset);
    return () => {
      reset();
      element.removeEventListener('pointermove', move);
      element.removeEventListener('pointerleave', reset);
      element.removeEventListener('pointercancel', reset);
      media.removeEventListener('change', reset);
    };
  }, [strength]);
  return ref;
}
