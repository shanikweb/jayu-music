import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollToPlugin);

/**
 * Smoothly scroll to in-page anchors using GSAP ScrollToPlugin.
 * Attach to a container (or document) to intercept local anchor clicks.
 */
export function useSmoothAnchors(container?: HTMLElement | null) {
  useEffect(() => {
    const root = container ?? document;
    function onClick(e: Event) {
      const t = e.target as HTMLElement | null;
      if (!t) return;
      // Ascend to nearest anchor
      const a = t.closest('a[href^="#"]') as HTMLAnchorElement | null;
      if (!a) return;
      const id = a.getAttribute('href');
      if (!id || id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      gsap.to(window, { duration: 0.6, ease: 'power2.out', scrollTo: { y: target as Element, offsetY: 16 } });
    }
    root.addEventListener('click', onClick);
    return () => root.removeEventListener('click', onClick);
  }, [container]);
}

