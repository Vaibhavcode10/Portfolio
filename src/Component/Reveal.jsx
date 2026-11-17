import { useEffect, useRef } from 'react';

export default function Reveal({ children, delay = 0, direction = 'up' }) {
  const ref = useRef(null);
  useEffect(() => {
    const element = ref.current;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!element || media.matches || !('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        element.dataset.reveal = 'visible';
        observer.disconnect();
      }
    }, { threshold: 0, rootMargin: '0px 0px -32px 0px' });
    element.dataset.reveal = 'pending';
    observer.observe(element);
    const show = () => {
      if (media.matches) {
        element.dataset.reveal = 'visible';
        observer.disconnect();
      }
    };
    const focus = () => {
      element.dataset.reveal = 'visible';
      observer.disconnect();
    };
    element.addEventListener('focusin', focus);
    media.addEventListener('change', show);
    return () => {
      observer.disconnect();
      media.removeEventListener('change', show);
      element.removeEventListener('focusin', focus);
      delete element.dataset.reveal;
    };
  }, []);
  return <div ref={ref} className="reveal" data-direction={direction} style={{ '--reveal-delay': `${delay}s` }}>{children}</div>;
}
