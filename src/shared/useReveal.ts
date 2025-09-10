import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register the ScrollTrigger plugin once.  If this file is imported
// multiple times GSAP guards against double registration.
gsap.registerPlugin(ScrollTrigger);

/**
 * Hook that animates an element into view when it enters the viewport.
 * @param opts Optional GSAP tween vars to override defaults.  See
 *  https://greensock.com/docs/v3/GSAP/gsap.to for available options.
 * @returns A ref to attach to the element you want to reveal.
 */
export function useReveal<T extends HTMLElement>(opts?: gsap.TweenVars) {
  const revealRef = useRef<T | null>(null);

  useLayoutEffect(() => {
    const el = revealRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
          },
          ...opts,
        }
      );
    });
    return () => ctx.revert();
  }, [opts]);

  return revealRef;
}