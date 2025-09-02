"use client";

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useRef, useState } from 'react';
import Image from 'next/image';
import styles from './page.module.css'

export default function Home() {
  const [isPaused, setIsPaused] = useState(true);
  const [, setFrame] = useState(0);
  const dotRefs = [useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null)];
  const animations = useRef<Array<gsap.core.Tween | null>>([null, null, null, null]);

  useGSAP(() => {
    const dotSize = 50;
    const leftMargin = 20;
    const colors = [
      { base: '#888', active: 'blue', filter: 'blur(8px)', activeFilter: 'blur(0px)', opacity: 0.4, activeOpacity: 1 },
      { base: '#888', active: 'red', filter: 'blur(8px)', activeFilter: 'blur(0px)', opacity: 0.4, activeOpacity: 1 },
      { base: '#888', active: 'green', filter: 'blur(8px)', activeFilter: 'blur(0px)', opacity: 0.4, activeOpacity: 1 },
      { base: '#888', active: 'gold', filter: 'blur(8px)', activeFilter: 'blur(0px)', opacity: 0.4, activeOpacity: 1 },
    ];
    const staggers = [1, 4, 2.4, 3.2]; // seconds
    const updateAnimation = () => {
      const arcedBox = document.querySelector(`.${styles.arcedBox}`) as HTMLElement;
      const arcedRect = arcedBox?.getBoundingClientRect();
      const width = arcedRect ? arcedRect.width : window.innerWidth;
      const distance = width - dotSize - leftMargin;
      const endX = distance + dotSize + leftMargin;
      dotRefs.forEach((ref, i) => {
        if (!ref.current) return;
        if (animations.current[i]) animations.current[i]?.kill();
  gsap.set(ref.current, { x: -dotSize - leftMargin, opacity: 0.7 });
        animations.current[i] = gsap.to(ref.current, {
          x: endX,
          duration: 4,
          repeat: -1,
          yoyo: false,
          ease: 'linear',
          paused: isPaused,
          delay: staggers[i],
          onRepeat: function() {
            if (ref.current) {
              gsap.set(ref.current, { x: -dotSize - leftMargin });
            }
          },
          onUpdate: function() {
            if (!ref.current) return;
            const x = gsap.getProperty(ref.current, 'x');
            if (typeof x === 'number') {
              if (x < distance / 2) {
                gsap.set(ref.current, {
                  opacity: 0.7
                });
              } else {
                gsap.set(ref.current, {
                  opacity: 1
                });
              }
            }
            setFrame(f => f + 1); // force re-render so image updates
          }
        });
      });
    };
    updateAnimation();
    window.addEventListener('resize', updateAnimation);
    return () => window.removeEventListener('resize', updateAnimation);
  }, [isPaused]);

  const toggleAnimation = () => {
    animations.current.forEach(anim => {
      if (anim) {
        if (isPaused) {
          anim.play();
        } else {
          anim.pause();
        }
      }
    });
    setIsPaused(!isPaused);
  };

  return (
    <div className={styles.container} suppressHydrationWarning>
      <div className={styles.leftFade}></div>
      <div className={styles.rightFade}></div>
      <div className={styles.arcedBox}></div>
      {[0,1,2,3].map(i => {
        const middle = ((document.querySelector(`.${styles.arcedBox}`)?.getBoundingClientRect().width ?? window.innerWidth) - 50 - 20) / 2;
        const x = dotRefs[i].current ? gsap.getProperty(dotRefs[i].current, 'x') : 0;
        // Blend factor: 0 (all normprofpic) to 1 (all smileprofpic)
        let blend = 0;
        if (typeof x === 'number') {
          const blendStart = middle - 25;
          const blendEnd = middle + 25;
          if (x <= blendStart) blend = 0;
          else if (x >= blendEnd) blend = 1;
          else blend = (x - blendStart) / (blendEnd - blendStart);
        }
        return (
          <div ref={dotRefs[i]} className={styles.dot} style={{top: ["36%","43%","52%","55%"] [i], position: 'absolute', width: 80, height: 80}} key={i}>
            <div style={{position: 'relative', width: 80, height: 80}}>
              <Image
                src="/normprofpic.png"
                alt="Profile"
                width={80}
                height={80}
                style={{
                  borderRadius: '50%',
                  filter: 'grayscale(60%)',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  opacity: 1 - blend,
                  transition: 'opacity 0.2s linear'
                }}
              />
              <Image
                src="/smileprofpic.png"
                alt="Profile"
                width={80}
                height={80}
                style={{
                  borderRadius: '50%',
                  filter: 'grayscale(60%)',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  opacity: blend,
                  transition: 'opacity 0.2s linear'
                }}
              />
            </div>
          </div>
        );
      })}
  <div className={styles.gradientLine}></div>
  {/* Right-side images for reference, if needed */}
  {/*
  {[0,1,2,3].map(i => (
    <div
      key={i}
      style={{
        position: 'absolute',
        right: 20,
        top: ["36%","43%","52%","55%"] [i],
        transform: 'translateY(-50%)',
        zIndex: 2,
      }}
    >
      <Image src="/smileprofpic.png" alt="Profile" width={80} height={80} style={{borderRadius: '50%'}} />
    </div>
  ))}
  */}
      <button onClick={toggleAnimation} className={styles.button}>
        {isPaused ? 'Play' : 'Pause'}
      </button>
    </div>
  );
}




