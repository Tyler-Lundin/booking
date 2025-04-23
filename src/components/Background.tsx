'use client';

import { useEffect, useState } from 'react';

export function Background() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div 
      className="fixed inset-0 -z-10 h-[200vh] w-[200vw] bg-white"
      style={{
        backgroundImage: 'radial-gradient(#000000_1px,transparent_1px)',
        backgroundSize: '16px 16px',
        transform: `translateY(${scrollY * 0.1}px)`,
        transition: 'transform 0.1s ease-out'
      }}
    />
  );
} 