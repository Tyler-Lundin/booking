'use client';

import { useEffect, useState } from 'react';

export function Background() {
  const [offsetY, setOffsetY] = useState(0);

  useEffect(() => {
    const onScroll = () => setOffsetY(window.scrollY);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      className="fixed inset-0 -z-10 h-[200vh] transition-transform duration-100 ease-out dark:invert"
      style={{
        transform: `translateY(${offsetY * 0.1 - 235}px)`,
        backgroundImage: `
          radial-gradient(var(--dot-color, rgba(0, 0, 0, 0.15)) 1px, transparent 1px)
        `,
        backgroundSize: '24px 24px',
        backgroundColor: 'var(--bg-color, #f8f9fa)',
      }}
    />
  );
}
