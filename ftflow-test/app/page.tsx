"use client";

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useRef, useState } from 'react';
import styles from './page.module.css'

export default function Home() {
  const [isPaused, setIsPaused] = useState(true);
  const dotRef = useRef<HTMLDivElement>(null);
  const animation = useRef<gsap.core.Tween | null>(null);

  useGSAP(() => {
    if (dotRef.current) {
      const dotSize = 50;
      const leftMargin = 20;
      gsap.set(dotRef.current, { x: -dotSize - leftMargin, backgroundColor: '#888', filter: 'blur(8px)', opacity: 0.4 });
      const updateAnimation = () => {
        const distance = window.innerWidth - dotSize - leftMargin;
        const endX = distance + dotSize + leftMargin;
        if (animation.current) animation.current.kill();
        gsap.set(dotRef.current, { x: -dotSize - leftMargin });
        animation.current = gsap.to(dotRef.current, {
          x: endX,
          duration: 3,
          repeat: -1,
          yoyo: false,
          ease: 'power1.in',
          paused: isPaused,
          onRepeat: function() {
            if (dotRef.current) {
              gsap.set(dotRef.current, { x: -dotSize - leftMargin });
            }
          },
          onUpdate: function() {
            if (!dotRef.current) return;
            const x = gsap.getProperty(dotRef.current, 'x');
            if (typeof x === 'number') {
              if (x < distance / 2) {
                gsap.set(dotRef.current, {
                  backgroundColor: '#888',
                  filter: 'blur(8px)',
                  opacity: 0.4
                });
              } else {
                gsap.set(dotRef.current, {
                  backgroundColor: 'blue',
                  filter: 'blur(0px)',
                  opacity: 1
                });
              }
            }
          }
        });
      };
      updateAnimation();
      window.addEventListener('resize', updateAnimation);
      return () => window.removeEventListener('resize', updateAnimation);
    }
  }, [isPaused]);

  const toggleAnimation = () => {
    if (animation.current) {
      if (isPaused) {
        animation.current.play();
      } else {
        animation.current.pause();
      }
      setIsPaused(!isPaused);
    }
  };

  return (
    <div className={styles.container} suppressHydrationWarning>
      <div className={styles.leftFade}></div>
      <div className={styles.rightFade}></div>
      <div ref={dotRef} id="blue-dot" className={styles.blueDot}></div>
      <div className={styles.gradientLine}></div>
      <div className={styles.arcedBox}></div>
      <button onClick={toggleAnimation} className={styles.button}>
        {isPaused ? 'Play' : 'Pause'}
      </button>
    </div>
  )
}


