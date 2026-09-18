'use client';

import { useEffect } from 'react';

export function ShipSmartMotion() {
  useEffect(() => {
    const root = document.documentElement;
    const elements = Array.from(
      document.querySelectorAll<HTMLElement>('[data-ss-motion]')
    );

    root.classList.add('ss-motion-ready');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.14 }
    );

    elements.forEach((element) => observer.observe(element));

    return () => {
      observer.disconnect();
      root.classList.remove('ss-motion-ready');
    };
  }, []);

  return null;
}
