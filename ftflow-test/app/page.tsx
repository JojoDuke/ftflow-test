"use client";

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useRef, useState } from 'react';
import styles from './page.module.css'

export default function Home() {
  const [isPaused, setIsPaused] = useState(true);
  const boxRef = useRef<HTMLDivElement>(null);
  const animation = useRef<gsap.core.Tween | null>(null);

  useGSAP(() => {
    if (boxRef.current) {
      gsap.set(boxRef.current, { x: 0, backgroundColor: '#888', filter: 'blur(8px)', opacity: 0.4 });
      const boxWidth = 100;
      const leftMargin = 20;
      const updateAnimation = () => {
        const distance = window.innerWidth - boxWidth - leftMargin;
        const center = distance / 2;
        if (animation.current) animation.current.kill();
        animation.current = gsap.to(boxRef.current, {
          x: distance,
          duration: 3,
          repeat: -1,
          yoyo: true,
          ease: 'power1.inOut',
          paused: isPaused,
          onUpdate: function() {
            if (!boxRef.current) return;
            // Get current x position
            const x = gsap.getProperty(boxRef.current, 'x');
            if (typeof x === 'number') {
              if (x < center) {
                gsap.set(boxRef.current, {
                  backgroundColor: '#888',
                  filter: 'blur(8px)',
                  opacity: 0.4
                });
              } else {
                // Animate to blue, clear, and full opacity
                gsap.set(boxRef.current, {
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
      <div ref={boxRef} id="blue-box" className={styles.blueBox}></div>
      <div className={styles.gradientLine}></div>
      <div className={styles.arcedBox}></div>
      <button onClick={toggleAnimation} className={styles.button}>
        {isPaused ? 'Play' : 'Pause'}
      </button>
    </div>
  )
}


