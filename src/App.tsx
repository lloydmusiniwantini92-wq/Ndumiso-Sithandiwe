import React, { useRef, useEffect, useState, createContext, useContext } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring, useInView, useVelocity, useReducedMotion } from 'motion/react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Heart, ArrowRight, Menu, X, Volume2, VolumeX } from 'lucide-react';

const journeyData = [
  {
    id: 1,
    date: 'January 2023',
    image: '/photos/couple-standing-smile.jpg',
    text: 'A spark over shared plates and endless conversation. Our story began under a crescent moon.',
    likes: 45,
  },
  {
    id: 2,
    date: 'July 2023',
    image: '/photos/couple-back-to-back.jpg',
    text: 'Sun-drenched memories and waves of joy. Adventures became our language and laughter our home.',
    likes: 62,
  },
  {
    id: 3,
    date: 'December 2024',
    subtitle: 'The Question',
    image: '/photos/couple-embrace-ring.jpg',
    text: 'Underneath the stars and amidst blooming roses, he asked forever. And she said yes.',
    likes: 128,
  },
  {
    id: 4,
    date: 'October 2025',
    subtitle: 'The Engagement Party',
    image: '/photos/couple-gazing-smile.jpg',
    text: 'Surrounded by our closest friends and family, we toasted to the future and danced until dawn.',
    likes: 184,
  },
  {
    id: 5,
    date: 'April 2026',
    subtitle: 'Tying The Knot',
    image: '/photos/couple-embrace-tender.jpg',
    text: 'The day two souls become one. A celebration of love, commitment, and a lifetime of shared dreams.',
    likes: 240,
  }
];

// --- AUDIO SYSTEM ---

const AudioContext = createContext({
  triggerCrescendo: () => {},
  isMuted: true,
  toggleMute: () => {},
  hasInteracted: false,
});

function fadeVolume(audio: HTMLAudioElement, targetVolume: number, duration: number, onComplete?: () => void) {
  const startVolume = audio.volume;
  const change = targetVolume - startVolume;
  const startTime = performance.now();

  function step(currentTime: number) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easeProgress = progress * (2 - progress);
    
    audio.volume = Math.max(0, Math.min(1, startVolume + change * easeProgress));

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      if (onComplete) onComplete();
    }
  }
  requestAnimationFrame(step);
}

function AudioProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isCrescendo, setIsCrescendo] = useState(false);

  useEffect(() => {
    const audio = new Audio('/Iyaman\'mana Original.mp3');
    audio.loop = true;
    audio.volume = 0; 
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, []);

  useEffect(() => {
    const handleInteraction = () => {
      if (!hasInteracted) {
        setHasInteracted(true);
        setIsMuted(false);
        if (audioRef.current) {
          audioRef.current.play().catch(e => console.log('Autoplay blocked', e));
          fadeVolume(audioRef.current, 0.25, 3000); // Quarter volume as baseline
        }
      }
    };

    window.addEventListener('click', handleInteraction, { once: true });
    return () => window.removeEventListener('click', handleInteraction);
  }, [hasInteracted]);

  const triggerCrescendo = () => {
    setIsCrescendo(true);
    if (!audioRef.current) return;
    
    if (audioRef.current.paused && !isMuted) {
      audioRef.current.play().catch(console.error);
    }
    
    if (!isMuted) {
      // Cinematic surge: rise volume significantly
      fadeVolume(audioRef.current, 0.7, 2000);
      
      // Graceful descent back to the normal 25% after the transition climax
      setTimeout(() => {
         if (audioRef.current && !audioRef.current.paused) {
           fadeVolume(audioRef.current, 0.25, 5000);
           setIsCrescendo(false);
         }
      }, 10000);
    }
  };

  const toggleMute = () => {
    setIsMuted(prev => {
      const next = !prev;
      if (!audioRef.current) return next;

      if (!next) { 
        audioRef.current.play().catch(console.error);
        const targetVol = isCrescendo ? 0.7 : 0.25;
        fadeVolume(audioRef.current, targetVol, 1200);
      } else { 
        fadeVolume(audioRef.current, 0, 1000, () => audioRef.current?.pause());
      }
      return next;
    });
  };

  return (
    <AudioContext.Provider value={{ triggerCrescendo, isMuted, toggleMute, hasInteracted }}>
      {children}
    </AudioContext.Provider>
  );
}

// --- COMPONENTS ---

// Advanced physics-based magnetic wrapper for luxury interactions
function MagneticWrapper({ children, className = "" }: any) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current!.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.25, y: middleY * 0.25 });
  };

  const reset = () => setPosition({ x: 0, y: 0 });

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className={`relative inline-flex z-10 ${className}`}
    >
      {children}
    </motion.div>
  );
}

function Preloader({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = 2000; 
    const interval = 20; 
    let current = 0;
    
    const timer = setInterval(() => {
      current += (100 / (duration / interval));
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
      exit={{ y: "-100%", filter: "blur(20px)" }}
      transition={{ duration: 1.4, ease: [0.76, 0, 0.24, 1] }}
    >
      <div className="overflow-hidden mb-6 flex items-center gap-4">
        <motion.div 
          initial={{ y: 50, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }} 
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="font-sans text-[10px] tracking-[0.4em] uppercase text-paper/50"
        >
          Ndumiso & Sithandiwe
        </motion.div>
      </div>
      <div className="font-serif text-[8rem] md:text-[14rem] leading-none tracking-tighter tabular-nums font-light">
        {progress}
        <span className="text-4xl text-paper/30 ml-2">%</span>
      </div>
      <div className="absolute bottom-16 md:bottom-24 w-64 h-[1px] bg-paper/10 overflow-hidden">
        <motion.div 
          className="h-full bg-paper"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>
    </motion.div>
  );
}

function CustomCursor() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 500, damping: 28, mass: 0.5 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      mouseX.set(e.clientX - 8);
      mouseY.set(e.clientY - 8);
    };
    
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName.toLowerCase() === 'a' || target.tagName.toLowerCase() === 'button' || target.closest('a') || target.closest('button')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', updateMousePosition);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [mouseX, mouseY]);

  return (
    <motion.div
      className="fixed top-0 left-0 w-4 h-4 bg-paper rounded-full pointer-events-none z-[10000] mix-blend-difference hidden md:block"
      style={{
        x: cursorX,
        y: cursorY
      }}
      animate={{
        scale: isHovering ? 2.5 : 1,
        opacity: 1
      }}
      transition={{ scale: { type: "spring", stiffness: 300, damping: 20 } }}
    />
  );
}

function Footer({ isDark = false, bgImage }: { isDark?: boolean, bgImage?: string }) {
  const bgClass = isDark ? 'bg-ink' : 'bg-paper';
  const textClass = isDark ? 'text-paper' : 'text-ink';
  const borderClass = isDark ? 'border-paper/10' : 'border-ink/10';
  
  return (
    <footer className={`w-full relative flex flex-col items-center justify-between ${bgImage ? 'min-h-[90vh] md:min-h-screen pt-36 pb-3 md:pb-4' : 'pt-48 pb-48'} overflow-hidden ${!bgImage && bgClass} ${textClass} border-t ${borderClass}`}>
      
      {bgImage && (
        <div className="absolute inset-0 z-0 pointer-events-none">
          <img 
            src={bgImage} 
            alt="Footer Couple"
            className="w-full h-full object-cover origin-top brightness-[0.85] contrast-[1.05]" 
            style={{ objectPosition: 'center 0%' }}
          />
          {/* Top smooth blend from light page content */}
          <div className="absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-paper via-paper/50 to-transparent pointer-events-none" />
          {/* Cinematic vignette for text legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_25%,rgba(5,5,5,0.75)_100%)] pointer-events-none" />
        </div>
      )}

      {/* Background Watermark Typography */}
      {bgImage ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 2, ease: [0.76, 0, 0.24, 1] }}
          className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-between pointer-events-none select-none px-6 md:px-16 w-full z-10"
        >
          <span 
            className="font-serif text-[8.5vw] md:text-[8vw] font-light text-paper/90 tracking-tight"
            style={{ textShadow: '0 4px 30px rgba(0,0,0,0.9), 0 0 60px rgba(0,0,0,0.7)' }}
          >
            Ndumiso
          </span>
          <span 
            className="font-serif italic font-light px-4 md:px-8 text-[6vw] text-[#F3E5D8]/90"
            style={{ textShadow: '0 4px 25px rgba(0,0,0,0.9)' }}
          >
            &amp;
          </span>
          <span 
            className="font-serif text-[8.5vw] md:text-[8vw] font-light text-paper/90 tracking-tight"
            style={{ textShadow: '0 4px 30px rgba(0,0,0,0.9), 0 0 60px rgba(0,0,0,0.7)' }}
          >
            Sithandiwe
          </span>
        </motion.div>
      ) : (
        <div className="absolute inset-0 pointer-events-none select-none opacity-[0.03]">
          <svg width="100%" height="100%">
            <defs>
              <pattern 
                id="watermark-pattern" 
                x="0" y="0" 
                width="1200" height="300" 
                patternUnits="userSpaceOnUse"
                patternTransform="rotate(-12)"
              >
                {/* Row 1 */}
                <text x="0" y="120" className="font-serif italic text-[4rem] fill-ink">
                  Ndumiso &amp; Sithandiwe
                </text>
                {/* Row 2 (offset for symmetry) */}
                <text x="600" y="270" className="font-serif italic text-[4rem] fill-ink">
                  Ndumiso &amp; Sithandiwe
                </text>
                {/* Row 2 Wrapped (prevents truncation on the left edge) */}
                <text x="-600" y="270" className="font-serif italic text-[4rem] fill-ink">
                  Ndumiso &amp; Sithandiwe
                </text>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#watermark-pattern)" />
          </svg>
        </div>
      )}

      {/* Interactive CTA - Lowered significantly onto the black gown to fully reveal her smile */}
      <div className="relative z-20 mt-auto mb-2 md:mb-3">
        <MagneticWrapper>
          <Link 
            to="/details" 
            className="group relative flex items-center gap-5 px-8 md:px-9 py-3.5 md:py-4 rounded-full border border-[#E8D3B9]/50 bg-ink/85 backdrop-blur-2xl transition-all duration-500 shadow-[0_15px_40px_rgba(0,0,0,0.85)] hover:shadow-[0_20px_50px_rgba(232,211,185,0.3)] hover:border-[#E8D3B9] hover:bg-[#FAF8F5]"
          >
            <div className="flex flex-col items-start text-left">
              <span className="font-sans text-[9px] tracking-[0.45em] uppercase font-bold text-[#E8D3B9] group-hover:text-ink/70 transition-colors">
                Wedding Event
              </span>
              <span className="font-serif text-lg md:text-xl italic font-normal text-paper group-hover:text-ink transition-colors leading-tight">
                RSVP &amp; Details
              </span>
            </div>
            <div className="w-9 h-9 rounded-full border border-[#E8D3B9]/40 group-hover:border-ink/20 flex items-center justify-center bg-paper/5 group-hover:bg-ink group-hover:text-paper transition-all duration-500">
              <ArrowRight className="w-3.5 h-3.5 text-[#E8D3B9] group-hover:text-paper group-hover:translate-x-0.5 transition-all" />
            </div>
          </Link>
        </MagneticWrapper>
      </div>

      {/* Bottom Legal / Engineered By */}
      <div className={`relative z-20 w-full px-6 md:px-14 flex flex-col md:flex-row items-center justify-between py-2.5 text-paper`}>
        <div className="font-sans text-[11px] tracking-[0.35em] uppercase font-medium text-paper/85 mb-3 md:mb-0 drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)]">
          © 2026 Ndumiso &amp; Sithandiwe
        </div>
        <MagneticWrapper>
          <a 
            href="https://arsonPixelz.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group flex items-center gap-3 font-sans text-[11px] tracking-[0.35em] uppercase text-paper/85 hover:text-paper transition-all p-1 drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)]"
          >
            <span className="font-light">Engineered by</span>
            <span className="font-bold tracking-[0.4em] relative overflow-hidden text-paper">
              arsonPixelz
              <span className="absolute bottom-0 left-0 w-full h-px bg-current -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out" />
            </span>
          </a>
        </MagneticWrapper>
      </div>
    </footer>
  );
}

function TimelineItem({ item, index }: { item: any, index: number }) {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(item.likes);
  const [isExpanded, setIsExpanded] = useState(false);
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { margin: "-40% 0px -40% 0px" });

  const toggleLike = () => {
    setLikesCount((prev: number) => isLiked ? prev - 1 : prev + 1);
    setIsLiked(!isLiked);
  };

  const isEven = index % 2 === 0;

  return (
    <motion.div ref={containerRef} layout className={`w-full flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} items-center justify-between gap-12 md:gap-24 my-32 md:my-48 relative z-10 max-w-[80rem] mx-auto px-6`}>
      
      {/* Central Connecting Stem Line */}
      <div className="absolute left-1/2 top-[-30%] bottom-[-30%] w-px bg-ink/10 -translate-x-1/2 hidden md:block z-0">
        {/* Pulsing Stem Glow */}
        <motion.div 
          animate={isInView ? { opacity: [0, 1, 0] } : { opacity: 0 }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="w-full h-full bg-gradient-to-b from-transparent via-[#DFB78C] to-transparent blur-[1px]"
        />
      </div>
      
      {/* Central Dot Node */}
      <div className="hidden md:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
        {/* Pulsing Dot Halo */}
        <motion.div 
          animate={isInView ? { scale: [1, 2.5, 1], opacity: [0, 0.6, 0] } : { scale: 1, opacity: 0 }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
          className="absolute inset-0 rounded-full bg-[#DFB78C] blur-[4px]"
        />
        <motion.div 
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, delay: 0.2, type: "spring" }}
          className="w-4 h-4 rounded-full bg-ink border-[3px] border-paper shadow-xl relative z-10 will-change-transform" 
        />
      </div>

      {/* Massive Background Number */}
      <motion.div 
        initial={{ opacity: 0, x: isEven ? 50 : -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className={`absolute top-1/2 -translate-y-1/2 ${isEven ? 'right-0 md:right-auto md:left-[55%]' : 'left-0 md:left-auto md:right-[55%]'} text-[12rem] md:text-[20rem] font-serif italic leading-none text-ink/[0.03] select-none pointer-events-none z-0 will-change-transform`}
      >
        0{index + 1}
      </motion.div>

      {/* Image Block (Expanding) */}
      <motion.div 
        layout
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className={`relative z-40 cursor-pointer ${isExpanded ? 'w-full h-[75vh]' : 'w-full md:w-[45%] aspect-[4/5]'}`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {/* Pulsing Card Halo (Cascade Delay 0.5s) */}
        {!isExpanded && (
          <motion.div 
            animate={isInView ? { opacity: [0, 1, 0] } : { opacity: 0 }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute -inset-6 bg-[#DFB78C]/15 blur-2xl rounded-[3rem] -z-10 pointer-events-none"
          />
        )}
        
        <motion.div layout className={`relative w-full h-full rounded-[2rem] overflow-hidden group shadow-2xl bg-paper will-change-transform ${isExpanded ? 'border border-ink/5' : ''}`}>
          <motion.img
            layout
            src={item.image}
            alt={item.date}
            loading="lazy"
            className={`w-full h-full transition-transform duration-[2s] ${isExpanded ? 'object-cover object-[center_20%]' : 'object-cover object-[center_20%] group-hover:scale-105'}`}
            referrerPolicy="no-referrer"
          />
          {/* Subtle Hover Overlay */}
          {!isExpanded && (
            <div className="absolute inset-0 bg-ink/0 transition-colors duration-500 group-hover:bg-ink/10 flex items-center justify-center pointer-events-none">
              <span className="font-sans text-[10px] tracking-[0.4em] uppercase text-paper opacity-0 group-hover:opacity-100 transition-opacity duration-500 font-bold backdrop-blur-md px-6 py-3 rounded-full border border-paper/30">View Full</span>
            </div>
          )}
          {/* Expanded Close Overlay */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ delay: 0.4 }}
                className="absolute top-6 right-6 z-50"
              >
                <div className="font-sans text-[9px] tracking-[0.4em] uppercase text-ink bg-paper/90 backdrop-blur-md px-6 py-4 rounded-full border border-ink/10 shadow-lg flex items-center gap-3">
                  <span className="font-bold">Close</span>
                  <span className="opacity-30">|</span>
                  <span className="opacity-60">Restore</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {/* Text Content Block */}
      <AnimatePresence mode="popLayout">
        {!isExpanded && (
          <motion.div
            layout
            initial={{ opacity: 0, x: isEven ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={`w-full md:w-[45%] relative z-30 flex flex-col ${isEven ? 'items-start' : 'items-end text-right'} will-change-transform`}
          >
            {/* Pulsing Card Halo (Cascade Delay 0.5s) */}
            <motion.div 
              animate={isInView ? { opacity: [0, 1, 0] } : { opacity: 0 }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute -inset-6 bg-[#DFB78C]/15 blur-2xl rounded-[3rem] -z-10 pointer-events-none"
            />
            
            <div className="bg-paper p-10 md:p-14 shadow-xl border border-ink/5 rounded-[2rem] w-full relative overflow-hidden group">
              <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22/%3E%3C/svg%3E")' }} />

              <div className={`flex items-center gap-4 mb-8 ${isEven ? 'justify-start' : 'justify-end'}`}>
                {isEven && <div className="w-12 h-px bg-ink/30" />}
                <h2 className="font-sans text-[11px] md:text-xs tracking-[0.45em] uppercase text-ink/80 font-bold">{item.date}</h2>
                {!isEven && <div className="w-12 h-px bg-ink/30" />}
              </div>
              
              {item.subtitle && (
                <h3 className="font-serif text-4xl md:text-5xl mb-6 text-ink italic leading-tight font-normal">{item.subtitle}</h3>
              )}
              
              <p className="font-serif text-lg md:text-2xl leading-[1.75] text-ink/90 mb-10 font-light">{item.text}</p>
              
              <div className={`flex items-center gap-4 ${isEven ? 'justify-start' : 'justify-end'}`}>
                <MagneticWrapper>
                  <motion.button
                    whileTap={{ scale: 0.8 }}
                    onClick={(e) => { e.stopPropagation(); toggleLike(); }}
                    className={`transition-all duration-300 p-3 rounded-full border ${isLiked ? 'border-rose-400/30 text-rose-500 bg-rose-50' : 'border-ink/15 text-ink/40 hover:border-ink/50 hover:text-ink'}`}
                  >
                    <Heart 
                      className={`w-6 h-6 transition-all duration-300 ${isLiked ? 'fill-current scale-110' : ''}`} 
                      strokeWidth={1.5} 
                    />
                  </motion.button>
                </MagneticWrapper>
                <span className="font-sans text-[10px] tracking-[0.35em] text-ink/60 mt-1 font-bold">{likesCount} LIKES</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function Navigation() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isMuted, toggleMute } = useContext(AudioContext);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/journey', label: 'Journey' },
    { path: '/details', label: 'Details' }
  ];
  
  return (
    <>
      <nav className="fixed top-0 w-full z-50 px-6 py-8 flex items-center justify-between mix-blend-difference text-paper pointer-events-none">
        <MagneticWrapper>
          <div className="font-sans text-[11px] tracking-[0.45em] uppercase font-semibold pointer-events-auto p-4 select-none">N & S</div>
        </MagneticWrapper>

        <div className="flex items-center gap-2 md:gap-4 pointer-events-auto">
          <div className="hidden md:flex gap-4 mr-4">
            {navLinks.map((link) => (
              <MagneticWrapper key={link.path}>
                <Link 
                  to={link.path}
                  className={`font-sans text-[11px] tracking-[0.25em] uppercase font-medium transition-all hover:opacity-100 p-4 ${
                    location.pathname === link.path ? 'opacity-100 border-b border-paper' : 'opacity-60'
                  }`}
                >
                  {link.label}
                </Link>
              </MagneticWrapper>
            ))}
          </div>

          <MagneticWrapper>
            <button 
              onClick={toggleMute} 
              className="opacity-50 hover:opacity-100 transition-opacity p-4" 
              aria-label={isMuted ? "Unmute sound" : "Mute sound"}
            >
              {isMuted ? <VolumeX className="w-4 h-4 md:w-5 md:h-5" /> : <Volume2 className="w-4 h-4 md:w-5 md:h-5" />}
            </button>
          </MagneticWrapper>

          <MagneticWrapper>
            <button
              onClick={() => setIsMenuOpen(true)}
              className="md:hidden p-4 opacity-80 hover:opacity-100"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </MagneticWrapper>
        </div>
      </nav>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="fixed inset-0 z-[60] bg-ink flex flex-col items-center justify-center gap-10"
          >
            <div className="font-serif text-paper/[0.05] text-[18rem] leading-none italic absolute select-none pointer-events-none overflow-hidden w-full text-center">
              N
            </div>

            <button
              onClick={() => setIsMenuOpen(false)}
              className="absolute top-8 right-6 text-paper/60 hover:text-paper transition-colors p-4"
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>

            {navLinks.map((link, i) => (
              <motion.div
                key={link.path}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 16 }}
                transition={{ delay: 0.05 + i * 0.08, duration: 0.4 }}
              >
                <Link
                  to={link.path}
                  className={`font-serif text-5xl italic text-paper transition-opacity hover:opacity-100 p-4 ${
                    location.pathname === link.path ? 'opacity-100' : 'opacity-30'
                  }`}
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// --- Cinematic Configuration ---
const tSettings = { duration: 1.4, ease: [0.76, 0, 0.24, 1] };
// NOTE: No `scale`/`transform` here, and `filter` is reset to 'none' once the
// entrance finishes. Any lingering filter/transform on the page wrapper turns
// `position: fixed` children into scrolling ones (breaks static backdrops).
const pageVariants = {
  initial: { opacity: 0, filter: 'blur(10px)' },
  animate: { opacity: 1, filter: 'blur(0px)', transitionEnd: { filter: 'none' } },
  exit: { opacity: 0, filter: 'blur(10px)' },
};

// --- PAGES ---

function Home() {
  const { triggerCrescendo } = useContext(AudioContext);

  return (
    <motion.div 
      variants={pageVariants}
      initial="initial" animate="animate" exit="exit" transition={tSettings}
      className="min-h-screen bg-ink text-paper relative overflow-hidden flex flex-col items-center justify-center"
    >
      <motion.div 
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 3, ease: "easeOut" }}
        className="absolute inset-0 z-0"
      >
        <video 
          src="/hero_video.mp4" 
          autoPlay 
          muted 
          loop 
          playsInline
          className="w-full h-full object-cover object-center brightness-[0.65]"
        />
      </motion.div>

      <div className="relative z-10 text-center px-4 flex flex-col items-center">
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 1.5 }}
          className="font-sans text-[10px] md:text-xs tracking-[0.5em] uppercase text-paper/60 mb-8"
        >
          The Wedding Of
        </motion.p>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 1.5 }}
          className="font-serif text-5xl sm:text-7xl md:text-9xl lg:text-[10rem] leading-[0.88] tracking-tighter mb-12"
        >
          Ndumiso <motion.span 
            animate={{ 
              color: ['#FFFFFF', '#E5B3B3', '#FFFFFF'],
              scale: [1, 1.05, 1],
              rotate: [0, 2, 0, -2, 0]
            }}
            transition={{ 
              duration: 4, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="italic font-light inline-block"
          >&</motion.span><br/>Sithandiwe
        </motion.h1>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1.5 }}
        className="absolute bottom-12 md:bottom-16 left-1/2 -translate-x-1/2 z-20"
      >
        <MagneticWrapper>
          <Link 
            to="/journey" 
            onClick={triggerCrescendo}
            className="group flex items-center gap-6 font-sans text-[11px] tracking-[0.35em] uppercase border border-paper/20 px-10 py-5 rounded-full hover:bg-paper hover:text-ink transition-all duration-500"
          >
            <span>Enter the Story</span>
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-3" />
          </Link>
        </MagneticWrapper>
      </motion.div>
    </motion.div>
);
}

// --- Cinematic Chapters Backdrop ---------------------------------------------
// Scroll-linked reveal: as the Chapters section rises into view the photo
// emerges from darkness, pulls focus (soft -> sharp) and settles from a slow
// 1.14x push-in to 1x. Once the section reaches the top, every value locks and
// the image is fully static. While scrolling, a spring-damped "handheld camera"
// micro-jitter follows scroll velocity and settles back to stillness on stop.
// Perf: only opacity/transform are animated (GPU composited); filters are
// static per layer; honours prefers-reduced-motion.
function ChaptersBackdrop({ targetRef }: { targetRef: React.RefObject<HTMLElement | null> }) {
  const reduceMotion = useReducedMotion();

  // 0 when the section's top hits the viewport bottom, 1 when it reaches the top
  const { scrollYProgress } = useScroll({ target: targetRef, offset: ['start end', 'start start'] });
  // Weighty, film-like lag on the reveal
  const reveal = useSpring(scrollYProgress, { stiffness: 55, damping: 22, mass: 0.9, restDelta: 0.0005 });

  const imageOpacity = useTransform(reveal, [0, 0.15, 1], [0, 0.35, 1]);
  const pushIn      = useTransform(reveal, [0, 1], [1.14, 1]);
  const rise        = useTransform(reveal, [0, 1], ['5%', '0%']);
  const softFocus   = useTransform(reveal, [0.25, 0.9], [1, 0]);     // blurred copy fades out = focus pull
  const darkness    = useTransform(reveal, [0, 0.85], [0.9, 0.1]);   // emerges from black to a light veil

  // Velocity-driven micro-jitter (subtle, springy, returns to rest)
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const shake = useSpring(velocity, { stiffness: 420, damping: 14, mass: 0.6 });
  const jitterY = useTransform(shake, [-2500, 0, 2500], [-6, 0, 6], { clamp: true });
  const jitterX = useTransform(shake, [-2500, 0, 2500], [1.5, 0, -1.5], { clamp: true });
  const jitterR = useTransform(shake, [-2500, 0, 2500], [-0.12, 0, 0.12], { clamp: true });
  const jitterS = useTransform(shake, [-2500, 0, 2500], [1.008, 1, 1.008], { clamp: true });

  const imgSrc = '/photos/couple-embrace-direct.jpg';

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-ink" aria-hidden="true">
      {/* Reveal layer: opacity + push-in + rise */}
      <motion.div
        className="absolute inset-0 will-change-transform"
        style={reduceMotion ? { opacity: imageOpacity } : { opacity: imageOpacity, scale: pushIn, y: rise }}
      >
        {/* Jitter layer: tiny camera shake while scrolling */}
        <motion.div
          className="absolute inset-0 will-change-transform"
          style={reduceMotion ? undefined : { x: jitterX, y: jitterY, rotate: jitterR, scale: jitterS }}
        >
          {/* Sharp plate */}
          <img
            src={imgSrc}
            alt=""
            decoding="async"
            className="couple-backdrop"
            style={{ filter: 'blur(1.5px) brightness(0.9) contrast(1.05)' }}
          />
          {/* Soft-focus plate (static blur, only its opacity animates) */}
          {!reduceMotion && (
            <motion.img
              src={imgSrc}
              alt=""
              decoding="async"
              className="couple-backdrop"
              style={{ opacity: softFocus, filter: 'blur(14px) brightness(0.85)' }}
            />
          )}
        </motion.div>
      </motion.div>

      {/* Darkness veil: deep at entry, settles to a light 10% veil */}
      <motion.div className="absolute inset-0 bg-ink" style={{ opacity: darkness }} />

      {/* Cinematic vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(5,5,5,0.55)_100%)]" />

      {/* Film grain */}
      <div className="absolute inset-0 opacity-[0.04] mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%221.5%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22/%3E%3C/svg%3E")' }} />
    </div>
  );
}

function Journey() {
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const chaptersRef = useRef<HTMLElement>(null);

  const carouselImages = [
    "/photos/couple-embrace-ring.jpg",
    "/photos/couple-embrace-direct.jpg",
    "/photos/couple-embrace-tender.jpg",
    "/photos/couple-gazing-smile.jpg",
    "/photos/couple-standing-smile.jpg",
    "/photos/couple-back-to-back.jpg",
    "/photos/couple-seated-standing.jpg",
    "/photos/graduation-portrait-1.jpg",
    "/photos/graduation-portrait-2.jpg"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % carouselImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [carouselImages.length]);

  const glowY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <motion.div 
      variants={pageVariants}
      initial="initial" animate="animate" exit="exit" transition={tSettings}
      className="min-h-screen text-ink relative flex flex-col bg-paper"
    >
      {/* Luxury Materialistic White Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-paper">
        {/* Subtle noise texture */}
        <div className="absolute inset-0 opacity-[0.03] mix-blend-multiply pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%221.5%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22/%3E%3C/svg%3E")' }} />
      </div>

      <div className="relative h-screen w-full overflow-hidden flex flex-col items-center justify-end pb-20 md:pb-28 bg-ink shrink-0">
        <motion.div style={{ y: heroY }} className="absolute inset-0 z-0 w-full h-full">
          <AnimatePresence>
            <motion.img
              key={currentImageIndex}
              initial={{ opacity: 0, scale: 1.05, filter: 'blur(10px)', x: 20 }}
              animate={{ opacity: 0.7, scale: 1, filter: 'blur(0px)', x: 0 }}
              exit={{ opacity: 0, scale: 0.98, filter: 'blur(5px)', x: -20 }}
              transition={{ 
                opacity: { duration: 2.5, ease: "easeInOut" },
                filter: { duration: 2.5, ease: "easeInOut" },
                scale: { duration: 10, ease: "linear" },
                x: { duration: 10, ease: "linear" }
              }}
              src={carouselImages[currentImageIndex]}
              alt="Journey Hero Carousel"
              className="absolute inset-0 w-full h-full object-cover brightness-[0.88] origin-top"
              style={{ objectPosition: 'center 0%' }}
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-ink/15 z-10 pointer-events-none" />
        </motion.div>

        {/* Cinematic gradient cradle for high contrast and legibility */}
        <div className="absolute inset-x-0 bottom-0 h-96 bg-gradient-to-t from-ink via-ink/80 to-transparent pointer-events-none z-10" />
        <div className="absolute inset-x-0 bottom-0 h-64 backdrop-blur-md [mask-image:linear-gradient(to_top,black,transparent)] pointer-events-none z-10" />

        <div className="relative z-20 text-center px-4 flex flex-col items-center pointer-events-none mb-6">
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 1.2 }}
            className="font-sans text-[10px] md:text-xs tracking-[0.55em] uppercase text-paper/90 font-medium mb-3 drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]"
          >
            A Story in Five Chapters
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, filter: 'blur(30px)', y: 40 }}
            animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
            transition={{ delay: 0.9, duration: 2.2, ease: [0.76, 0, 0.24, 1] }}
            className="font-serif text-7xl sm:text-8xl md:text-[10.5rem] lg:text-[13rem] px-4 leading-[0.8] tracking-[-0.04em] text-paper text-center drop-shadow-[0_25px_60px_rgba(0,0,0,0.95)]"
          >
            <span className="block opacity-95">The</span>
            <span className="italic font-light opacity-90 -mt-6 md:-mt-10 block">Chapters</span>
          </motion.h1>
        </div>
      </div>

      {/* Permanent Chapters Timeline Section with Details Couple Image Background.
          clip-path: inset(0) makes this section a "window": the fixed image inside
          stays pinned to the viewport (static, like /details) but is only visible
          between the hero and the footer. */}
      <section ref={chaptersRef} className="relative w-full flex-grow bg-ink" style={{ clipPath: 'inset(0)' }}>
        {/* Background Image: identical framing to /details, cinematic reveal on scroll */}
        <ChaptersBackdrop targetRef={chaptersRef} />

        <main className="w-full max-w-[90rem] mx-auto relative py-20 lg:py-32 px-6 md:px-12 lg:px-24 z-10">
          <div className="relative z-10 w-full mt-10 mb-40">
            {journeyData.map((item, index) => (
              <TimelineItem key={index} item={item} index={index} />
            ))}
          </div>
        </main>
      </section>

      {/* Untainted Footer with couple-seated-standing.jpg */}
      <Footer isDark={true} bgImage="/photos/couple-seated-standing.jpg" />
    </motion.div>
  );
}

function Details() {
  const [isRsvpModalOpen, setIsRsvpModalOpen] = useState(false);
  const [rsvpData, setRsvpData] = useState({
    name: '',
    email: '',
    attendance: 'attending',
    guests: '1',
    notes: ''
  });
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <motion.div 
      variants={pageVariants}
      initial="initial" animate="animate" exit="exit" transition={tSettings}
      className="min-h-screen bg-ink text-paper relative"
    >
      {/* SVG Filter for Torn Paper Edges */}
      <svg className="hidden">
        <filter id="torn-paper" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="5" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="40" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>

      {/* Full Screen Fixed Background Image - Static & non-scrollable */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-ink overflow-hidden">
        {/* Layer 1: The Couple - centred on both faces, pinned to the viewport */}
        <img
          src="/photos/couple-embrace-direct.jpg"
          alt="Details Background"
          className="couple-backdrop opacity-95"
          style={{ filter: 'brightness(0.96) contrast(1.05)' }}
        />
        {/* Layer 1b: Wall florals - painted "onto the wall" BEHIND the couple.
            `lighten` only reveals the motif where the photo is darker than it
            (the grey studio wall) and hides it over skin & the white knit, so
            the flowers read as wall décor behind them. A blurred halo under a
            crisp line gives an embossed, dimensional feel. */}
        {[
          { pos: 'top-[-8%] left-[-8%]', rot: '-rotate-45' },
          { pos: 'top-[-8%] right-[-8%]', rot: 'rotate-45' },
        ].map(({ pos, rot }, i) => (
          <div
            key={i}
            className={`absolute ${pos} w-[34rem] h-[34rem] pointer-events-none transform ${rot}`}
            style={{ mixBlendMode: 'lighten' }}
          >
            {/* Soft halo (depth) */}
            <svg viewBox="0 0 24 24" fill="none" stroke="#3a342e" strokeWidth="0.7" strokeLinecap="round" className="absolute inset-0 w-full h-full" style={{ filter: 'blur(5px)' }}>
              <path d="M12 22V8" />
              <path d="M12 8c-3-3-8-2-8-2s1 5 4 8c2 2 4 2 4 2" />
              <path d="M12 8c3-3 8-2 8-2s-1 5-4 8c-2 2-4 2-4 2" />
              <path d="M12 12c-2-2-5-1-5-1s1 3 3 5" />
              <path d="M12 12c2-2 5-1 5-1s-1 3-3 5" />
            </svg>
            {/* Crisp engraved line */}
            <svg viewBox="0 0 24 24" fill="none" stroke="#6e6052" strokeWidth="0.16" strokeLinecap="round" className="absolute inset-0 w-full h-full">
              <path d="M12 22V8" />
              <path d="M12 8c-3-3-8-2-8-2s1 5 4 8c2 2 4 2 4 2" />
              <path d="M12 8c3-3 8-2 8-2s-1 5-4 8c-2 2-4 2-4 2" />
              <path d="M12 12c-2-2-5-1-5-1s1 3 3 5" />
              <path d="M12 12c2-2 5-1 5-1s-1 3-3 5" />
            </svg>
          </div>
        ))}
        
        {/* Layer 2: The Torn Paper Overlay with expanded facial aperture */}
        <div 
          className="absolute inset-0 bg-ink translate-z-0 will-change-transform"
          style={{
            maskImage: 'radial-gradient(ellipse 120% 140% at 50% 40%, transparent 64%, black 88%)',
            WebkitMaskImage: 'radial-gradient(ellipse 120% 140% at 50% 40%, transparent 64%, black 88%)',
            filter: 'url(#torn-paper)'
          }}
        />

        {/* Layer 3: Paper Texture / Grain */}
        <div className="absolute inset-0 opacity-[0.15] mix-blend-overlay pointer-events-none z-20 translate-z-0" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%221.8%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22/%3E%3C/svg%3E")' }} />
      </div>

      <div className="relative z-10 w-full max-w-[80rem] mx-auto px-6 md:px-12 lg:px-24 pt-24 pb-24 flex flex-col">
        {/* Hero Section */}
        <div className="flex flex-col items-center justify-start min-h-[85vh] text-center pt-8">
          
          {/* Top Title */}
          <motion.h1 
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, delay: 0.2 }}
            className="font-serif text-[5rem] md:text-[8.5rem] leading-[0.85] mb-auto tracking-tighter drop-shadow-xl"
          >
            The <br/>
            <span className="italic font-light text-[#F3E5D8] opacity-95 pr-8">Details</span>
          </motion.h1>

          {/* Bottom Content Block */}
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.5, delay: 0.8 }}
            className="flex flex-col items-center gap-6 mt-auto mb-10 w-full max-w-2xl mx-auto py-12 relative"
          >
            {/* Dark Radial Gradient Backdrop for Legibility */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-ink/75 via-ink/30 to-transparent pointer-events-none -z-10" />
            
            <div className="w-32 h-px bg-[#E8D3B9]/50" />
            <h2 
              className="font-serif text-3xl md:text-5xl italic font-light text-[#E8D3B9]"
              style={{ textShadow: '0 4px 20px rgba(0,0,0,0.8), 0 2px 4px rgba(0,0,0,0.8)' }}
            >
              A Celebration of Love
            </h2>
            <p 
              className="font-sans text-[11px] md:text-xs tracking-[0.45em] uppercase text-[#F5EDE4]/90 leading-loose px-4 font-medium"
              style={{ textShadow: '0 2px 10px rgba(0,0,0,0.9)' }}
            >
              Join us as we unite our families and embark on life's greatest chapter. Black tie strictly required.
            </p>
          </motion.div>
          
          {/* Itinerary Anchor */}
          <motion.div 
             initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.5, delay: 1.2 }}
             className="flex flex-col items-center gap-4 mt-4"
          >
            <div className="w-3 h-3 rounded-full bg-[#E8D3B9] shadow-[0_0_15px_#E8D3B9]" />
            <span 
              className="font-sans text-[11px] tracking-[0.45em] uppercase font-bold text-[#E8D3B9]"
              style={{ textShadow: '0 2px 10px rgba(0,0,0,0.9), 0 0 4px rgba(0,0,0,0.8)' }}
            >
              Itinerary
            </span>
          </motion.div>
        </div>

        {/* High-end 2 Column Split Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-24 md:gap-16 mb-32 relative text-paper" style={{ textShadow: '0 4px 15px rgba(0,0,0,0.9), 0 0 5px rgba(0,0,0,0.8)' }}>
           {/* Divider vertical on desktop */}
           <div className="hidden md:block absolute top-0 bottom-0 left-1/2 w-[1px] bg-[#E8D3B9]/30 -translate-x-1/2 shadow-xl" />
           <div className="md:hidden absolute top-[45%] left-[20%] right-[20%] h-[1px] bg-[#E8D3B9]/30 shadow-xl" />
           
          {/* Ceremony */}
          <motion.div
            initial={{ opacity: 0, y: 50, filter: 'blur(12px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
            className="flex flex-col items-center text-center md:pr-12 lg:pr-24"
          >
            <h2 className="font-serif text-4xl mb-8 italic text-[#E8D3B9]">01.</h2>
            <h3 className="font-serif text-5xl md:text-6xl mb-6 leading-tight text-paper">St. Patrick's <br/>Cathedral</h3>
            <p className="font-sans text-[11px] text-[#F5EDE4]/90 leading-loose mb-12 uppercase tracking-[0.25em]">
              5th Avenue &amp; 50th Street<br/>
              New York, NY 10022
            </p>
            <p className="font-serif text-4xl border-t border-[#E8D3B9]/40 pt-6 inline-block w-2/3 text-[#F3E5D8]">3:00 PM</p>
          </motion.div>

          {/* Reception */}
          <motion.div
            initial={{ opacity: 0, y: 50, filter: 'blur(12px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 1.2, delay: 0.2, ease: [0.76, 0, 0.24, 1] }}
            className="flex flex-col items-center text-center md:pl-12 lg:pl-24"
          >
            <h2 className="font-serif text-4xl mb-8 italic text-[#E8D3B9]">02.</h2>
            <h3 className="font-serif text-5xl md:text-6xl mb-6 leading-tight text-paper">The Plaza <br/>Hotel</h3>
            <p className="font-sans text-[11px] text-[#F5EDE4]/90 leading-loose mb-12 uppercase tracking-[0.25em]">
              768 5th Avenue<br/>
              New York, NY 10019
            </p>
            <p className="font-serif text-4xl border-t border-[#E8D3B9]/40 pt-6 inline-block w-2/3 text-[#F3E5D8]">6:00 PM</p>
          </motion.div>
        </div>

        {/* Luxury Translucent RSVP Enclosure - the single RSVP on this page,
            placed low where the old white footer block used to sit */}
        <motion.div
          initial={{ opacity: 0, y: 60, filter: 'blur(15px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1.4, ease: [0.76, 0, 0.24, 1] }}
          className="w-full bg-ink/35 backdrop-blur-md border border-[#E8D3B9]/25 rounded-3xl p-12 lg:p-24 py-16 lg:py-24 relative overflow-hidden flex flex-col items-center text-center shadow-2xl mt-40 md:mt-56"
        >
          {/* Elegant double inner border */}
          <div className="absolute inset-3 border border-[#E8D3B9]/15 rounded-2xl pointer-events-none" />
          
          <h2 className="font-sans text-[11px] tracking-[0.6em] uppercase text-[#E8D3B9] mb-8 relative z-10 font-bold">Respond</h2>
          <h3 className="font-serif text-6xl md:text-8xl mb-6 italic font-light relative z-10 text-paper">Kindly Reply</h3>
          <p className="font-sans text-[11px] md:text-xs text-[#F5EDE4]/80 mb-14 max-w-sm leading-loose tracking-[0.25em] relative z-10">
            Please honor us with your response by March 15th, 2026.
          </p>
          
          {/* Re-imagined Bespoke RSVP Button */}
          <MagneticWrapper>
            <button 
              onClick={() => setIsRsvpModalOpen(true)}
              className="group relative overflow-hidden flex items-center gap-6 px-12 py-5 rounded-full border border-[#E8D3B9] bg-[#E8D3B9] text-ink font-sans text-[11px] tracking-[0.45em] uppercase font-bold transition-all duration-500 shadow-[0_10px_35px_rgba(232,211,185,0.3)] hover:shadow-[0_15px_50px_rgba(232,211,185,0.5)] hover:bg-[#FAF8F5] hover:scale-[1.02]"
            >
              <span className="relative z-10 font-bold">Reserve Your Seat</span>
              <div className="w-8 h-8 rounded-full bg-ink text-paper flex items-center justify-center relative z-10 transition-transform duration-500 group-hover:translate-x-1">
                <ArrowRight className="w-4 h-4 text-[#E8D3B9]" />
              </div>
            </button>
          </MagneticWrapper>
        </motion.div>

        {/* Slim transparent credit line (no duplicate RSVP, no white block) */}
        <div className="relative z-10 w-full mt-32 mb-4 flex flex-col md:flex-row items-center justify-between gap-6 text-paper/85 font-sans text-[11px] tracking-[0.35em] uppercase" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.95)' }}>
          <span>© 2026 Ndumiso &amp; Sithandiwe</span>
          <a href="https://arsonPixelz.com" target="_blank" rel="noopener noreferrer" className="hover:text-paper transition-colors">
            <span className="font-light">Engineered by </span><span className="font-bold tracking-[0.4em]">arsonPixelz</span>
          </a>
        </div>
      </div>

      {/* RSVP Modal Dialog - Google Sheets Ready */}
      <AnimatePresence>
        {isRsvpModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-ink/80 backdrop-blur-2xl"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
              className="relative w-full max-w-lg bg-[#0E0E0E] border border-[#E8D3B9]/30 rounded-3xl p-8 md:p-12 shadow-[0_25px_80px_rgba(0,0,0,0.9)] text-paper overflow-hidden"
            >
              <button 
                onClick={() => setIsRsvpModalOpen(false)}
                className="absolute top-6 right-6 text-paper/60 hover:text-paper transition-colors p-2"
                aria-label="Close RSVP Modal"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center mb-8">
                <span className="font-sans text-[10px] tracking-[0.5em] uppercase text-[#E8D3B9] font-semibold block mb-2">
                  Wedding Celebration
                </span>
                <h3 className="font-serif text-3xl md:text-4xl italic text-paper font-light">
                  Kindly Respond
                </h3>
                <div className="w-16 h-px bg-[#E8D3B9]/40 mx-auto mt-4" />
              </div>

              {rsvpSubmitted ? (
                <div className="text-center py-10">
                  <div className="w-16 h-16 rounded-full bg-[#E8D3B9]/15 border border-[#E8D3B9]/40 flex items-center justify-center mx-auto mb-6 text-[#E8D3B9]">
                    <Heart className="w-8 h-8 fill-current" />
                  </div>
                  <h4 className="font-serif text-2xl text-paper mb-3 italic">Response Recorded</h4>
                  <p className="font-sans text-xs tracking-wider text-paper/70 leading-relaxed max-w-xs mx-auto mb-8">
                    Thank you for sharing in our joy. We cannot wait to celebrate with you!
                  </p>
                  <button
                    onClick={() => { setRsvpSubmitted(false); setIsRsvpModalOpen(false); }}
                    className="font-sans text-[11px] tracking-[0.3em] uppercase px-8 py-3 rounded-full border border-paper/30 text-paper hover:bg-paper hover:text-ink transition-colors"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <form 
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setIsSubmitting(true);
                    const endpoint = (import.meta as any).env?.VITE_RSVP_ENDPOINT || "https://script.google.com/macros/s/AKfycbyTGxdmSFL2N5hEisMyTjgGQ_aOcr06TKavP-PwevV8zwnHN6A-j8nVyk-3Vn3_rugSSA/exec";
                    if (endpoint) {
                      try {
                        await fetch(endpoint, {
                          method: 'POST',
                          mode: 'no-cors',
                          body: new URLSearchParams({ ...rsvpData, submittedAt: new Date().toISOString() }),
                        });
                      } catch (err) {
                        console.error('RSVP submission failed', err);
                      }
                    }
                    setIsSubmitting(false);
                    setRsvpSubmitted(true);
                  }}
                  className="flex flex-col gap-5 text-left"
                >
                  <div>
                    <label className="font-sans text-[10px] tracking-[0.3em] uppercase text-paper/70 block mb-2 font-medium">
                      Your Full Name *
                    </label>
                    <input 
                      required
                      type="text" 
                      placeholder="e.g. Johnathan & Guest"
                      value={rsvpData.name}
                      onChange={(e) => setRsvpData({ ...rsvpData, name: e.target.value })}
                      className="w-full bg-paper/5 border border-paper/15 rounded-xl px-4 py-3 text-sm text-paper placeholder:text-paper/25 focus:outline-none focus:border-[#E8D3B9] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="font-sans text-[10px] tracking-[0.3em] uppercase text-paper/70 block mb-2 font-medium">
                      Email Address *
                    </label>
                    <input 
                      required
                      type="email" 
                      placeholder="e.g. guest@example.com"
                      value={rsvpData.email}
                      onChange={(e) => setRsvpData({ ...rsvpData, email: e.target.value })}
                      className="w-full bg-paper/5 border border-paper/15 rounded-xl px-4 py-3 text-sm text-paper placeholder:text-paper/25 focus:outline-none focus:border-[#E8D3B9] transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="font-sans text-[10px] tracking-[0.3em] uppercase text-paper/70 block mb-2 font-medium">
                        Attendance
                      </label>
                      <select 
                        value={rsvpData.attendance}
                        onChange={(e) => setRsvpData({ ...rsvpData, attendance: e.target.value })}
                        className="w-full bg-[#181818] border border-paper/15 rounded-xl px-4 py-3 text-sm text-paper focus:outline-none focus:border-[#E8D3B9] transition-colors"
                      >
                        <option value="attending">Joyfully Accept</option>
                        <option value="declining">Regretfully Decline</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-sans text-[10px] tracking-[0.3em] uppercase text-paper/70 block mb-2 font-medium">
                        Guests
                      </label>
                      <select 
                        value={rsvpData.guests}
                        onChange={(e) => setRsvpData({ ...rsvpData, guests: e.target.value })}
                        className="w-full bg-[#181818] border border-paper/15 rounded-xl px-4 py-3 text-sm text-paper focus:outline-none focus:border-[#E8D3B9] transition-colors"
                      >
                        <option value="1">1 Person</option>
                        <option value="2">2 People</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="font-sans text-[10px] tracking-[0.3em] uppercase text-paper/70 block mb-2 font-medium">
                      Special Dietary / Notes
                    </label>
                    <textarea 
                      rows={2}
                      placeholder="Any allergies or heartfelt wishes..."
                      value={rsvpData.notes}
                      onChange={(e) => setRsvpData({ ...rsvpData, notes: e.target.value })}
                      className="w-full bg-paper/5 border border-paper/15 rounded-xl px-4 py-2.5 text-sm text-paper placeholder:text-paper/25 focus:outline-none focus:border-[#E8D3B9] transition-colors resize-none"
                    />
                  </div>

                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full mt-2 py-4 rounded-xl bg-[#E8D3B9] text-ink font-sans text-[11px] tracking-[0.4em] uppercase font-bold hover:bg-[#FAF8F5] transition-all shadow-[0_10px_30px_rgba(232,211,185,0.25)] disabled:opacity-60"
                  >
                    {isSubmitting ? "Sending Response..." : "Send RSVP Response"}
                  </button>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// --- APP WRAPPER ---

function AnimatedRoutes() {
  const location = useLocation();
  const isDetails = location.pathname === '/details';
  
  // Track scroll position to flip the arrow at the bottom
  const { scrollYProgress } = useScroll();
  const indicatorRotation = useTransform(scrollYProgress, [0.98, 1], [0, 180]);
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/journey" element={<Journey />} />
          <Route path="/details" element={<Details />} />
        </Routes>
      </AnimatePresence>
    </>
  );
}

export default function App() {
  const [loading, setLoading] = useState(true);

  return (
    <AudioProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-paper text-ink selection:bg-ink selection:text-paper relative">
          <CustomCursor />
          
          <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.04] mix-blend-multiply"
               style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}>
          </div>

          <AnimatePresence mode="wait">
            {loading ? (
              <Preloader key="preloader" onComplete={() => setLoading(false)} />
            ) : (
              <motion.div key="app-content" className="contents" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.5 }}>
                <Navigation />
                <AnimatedRoutes />
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </BrowserRouter>
    </AudioProvider>
  );
}
