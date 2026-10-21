import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';

interface PreloaderProps {
  onComplete: () => void;
}

export function Preloader({ onComplete }: PreloaderProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = 2000;
    const interval = 20;
    let current = 0;

    const timer = setInterval(() => {
      current += 100 / (duration / interval);
      if (current >= 100) {
        setProgress(100);
        clearInterval(timer);
        setTimeout(onComplete, 600);
      } else {
        setProgress(Math.floor(current));
      }
    }, interval);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-ink text-paper flex flex-col items-center justify-center pointer-events-none"
      initial={{ y: 0 }}
      exit={{ y: '-100%' }}
      transition={{ duration: 1.4, ease: [0.76, 0, 0.24, 1] }}
    >
      <div className="overflow-hidden mb-6 flex items-center gap-4">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
          className="font-sans text-[10px] tracking-[0.4em] uppercase text-paper/60"
        >
          Ndumiso &amp; Sithandiwe
        </motion.div>
      </div>
      <div className="font-serif text-[8rem] md:text-[14rem] leading-none tracking-tighter tabular-nums font-light">
        {progress}
        <span className="text-4xl text-paper/30 ml-2">%</span>
      </div>
      <div className="absolute bottom-16 md:bottom-24 w-64 h-[1px] bg-paper/10 overflow-hidden">
        <motion.div
          className="h-full bg-[#E8D3B9]"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>
    </motion.div>
  );
}
