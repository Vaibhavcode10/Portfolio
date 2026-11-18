import { useEffect, useRef } from 'react';
import './headline-transfer.css';

const clamp = value => Math.min(1, Math.max(0, value));
const mix = (from, to, progress) => from + (to - from) * progress;

function getFlight(progress, origin, destination, drift) {
  const eased = mix(progress, progress * progress * (3 - 2 * progress), 0.35);
  const arc = Math.sin(Math.PI * eased);
  return {
    x: mix(origin.x, destination.x, eased) + arc * drift,
    y: mix(origin.y, destination.y, eased),
    scale: mix(1, destination.width / origin.width, eased),
    tilt: -6 * arc,
  };
}

export default function HeadlineTransfer({ paused }) {
  const layer = useRef(null);

  useEffect(() => {
    if (paused) return;

    const word = layer.current;
    const main = word.parentElement;
    const origin = main.querySelector('[data-headline-origin]');
    const destination = main.querySelector('[data-headline-destination]');
    const banner = main.querySelector('[data-headline-banner]');
    if (!origin || !destination || !banner || !window.DOMMatrixReadOnly || !window.ResizeObserver) return;

    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = null;
    let geometry = null;
    let needsMeasurement = true;

    function measure() {
      const bounds = main.getBoundingClientRect();
      const relativeBox = element => {
        const box = element.getBoundingClientRect();
        return { x: box.left - bounds.left, y: box.top - bounds.top, width: box.width, height: box.height };
      };

      const from = relativeBox(origin);
      const to = relativeBox(destination);
      if (!from.width || !to.width) return null;

      const band = relativeBox(banner);
      const viewport = window.innerHeight;
      const pageTop = bounds.top + window.scrollY;
      const start = Math.max(0, pageTop + from.y + from.height / 2 - viewport * 0.47);
      const finish = Math.max(start + viewport * 0.32, pageTop + to.y + to.height / 2 - viewport * 0.68);
      const transform = getComputedStyle(banner).transform;
      const bandInverse = new DOMMatrixReadOnly(transform === 'none' ? undefined : transform).inverse();

      const font = getComputedStyle(origin);
      Object.assign(word.style, {
        fontFamily: font.fontFamily,
        fontSize: font.fontSize,
        fontStyle: font.fontStyle,
        fontWeight: font.fontWeight,
        letterSpacing: font.letterSpacing,
        lineHeight: font.lineHeight,
      });

      return {
        from, to, start, finish, bandInverse,
        drift: Math.min(105, bounds.width * 0.085),
        bandCenterX: band.x + band.width / 2,
        bandCenterY: band.y + band.height / 2,
        bandWidth: banner.offsetWidth,
        bandHeight: banner.offsetHeight,
      };
    }

    function clearImpact() {
      if (!banner.hasAttribute('data-headline-impact')) return;
      delete banner.dataset.headlineImpact;
      for (const name of ['x', 'y', 'width', 'height', 'strength']) {
        banner.style.removeProperty(`--headline-cut-${name}`);
      }
    }

    function paint() {
      frame = null;
      if (motion.matches) return;
      if (needsMeasurement) {
        geometry = measure();
        needsMeasurement = false;
      }
      if (!geometry) return;

      const { from, to, start, finish, drift, bandInverse, bandCenterX, bandCenterY, bandWidth, bandHeight } = geometry;
      const progress = clamp((window.scrollY - start) / (finish - start));
      const phase = progress === 0 ? 'ready' : progress === 1 ? 'landed' : 'flying';
      if (main.dataset.headlinePhase !== phase) main.dataset.headlinePhase = phase;
      if (phase !== 'flying') {
        clearImpact();
        return;
      }

      const { x, y, scale, tilt } = getFlight(progress, from, to, drift);
      word.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${tilt}deg) scale(${scale})`;

      const width = from.width * scale;
      const height = from.height * scale;
      const local = bandInverse.transformPoint({ x: x + width / 2 - bandCenterX, y: y + height / 2 - bandCenterY });
      const reach = bandHeight / 2 + height / 2;
      const strength = clamp((reach - Math.abs(local.y)) / (height * 0.65));
      word.style.setProperty('--headline-glow', (strength * 0.6).toFixed(3));
      if (!strength) {
        clearImpact();
        return;
      }

      banner.style.setProperty('--headline-cut-x', `${local.x + bandWidth / 2}px`);
      banner.style.setProperty('--headline-cut-y', `${local.y + bandHeight / 2}px`);
      banner.style.setProperty('--headline-cut-width', `${width * 0.74 + 20}px`);
      banner.style.setProperty('--headline-cut-height', `${height * 0.74 + 10}px`);
      banner.style.setProperty('--headline-cut-strength', strength.toFixed(3));
      banner.dataset.headlineImpact = '';
    }

    function schedule() {
      if (!motion.matches && frame === null) frame = requestAnimationFrame(paint);
    }

    function resize() {
      needsMeasurement = true;
      schedule();
    }

    function reset() {
      if (frame !== null) cancelAnimationFrame(frame);
      frame = null;
      delete main.dataset.headlinePhase;
      clearImpact();
      word.removeAttribute('style');
    }

    function motionChange() {
      if (motion.matches) reset();
      else resize();
    }

    const observer = new ResizeObserver(resize);
    for (const element of [main, origin, destination, banner]) observer.observe(element);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', resize);
    motion.addEventListener('change', motionChange);
    schedule();

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', resize);
      motion.removeEventListener('change', motionChange);
      reset();
    };
  }, [paused]);

  return <em className="headline-in-flight" ref={layer} aria-hidden="true">character.</em>;
}
