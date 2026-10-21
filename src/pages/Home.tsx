import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Heart } from 'lucide-react';
import { MagneticWrapper } from '../components/MagneticWrapper';
import {
  carouselImages,
  avantGardeTransitions,
  weddingEventConfig,
} from '../data/weddingData';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % carouselImages.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const { left, top, width, height } =
      containerRef.current.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;
    setMousePos({ x, y });
  };

  const activeVariant =
    avantGardeTransitions[currentImageIndex % avantGardeTransitions.length];

  return (
    <motion.div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0, filter: 'blur(10px)' }}
      animate={{ opacity: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0, filter: 'blur(10px)' }}
      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      className="relative h-screen w-full overflow-hidden flex flex-col items-center justify-between py-24 px-4 bg-[#0A0A0A]"
    >
      {/* Background Image Carousel with 7 Avant-Garde Transitions */}
      <div className="absolute inset-0 overflow-hidden bg-[#0A0A0A]">
        <AnimatePresence initial={false}>
          <motion.img
            key={currentImageIndex}
            src={carouselImages[currentImageIndex]}
            alt="Ndumiso & Sithandiwe"
            initial={activeVariant.initial}
            animate={{
              ...activeVariant.animate,
              x: mousePos.x * -15,
              y: mousePos.y * -15,
            }}
            exit={activeVariant.exit}
            className="absolute inset-0 w-full h-full object-cover will-change-transform"
            style={{
              objectPosition: 'center 8%',
              filter: 'none',
            }}
          />
        </AnimatePresence>
        {/* Subtle vignette only at top & bottom edges for typography contrast */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(to bottom, rgba(10,10,10,0.45) 0%, rgba(10,10,10,0.08) 30%, rgba(10,10,10,0.18) 65%, rgba(10,10,10,0.82) 100%)',
          }}
        />
      </div>

      <div className="relative z-10 text-center mt-12">
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 1 }}
          className="text-xs md:text-sm uppercase tracking-[0.4em] text-[#E8D3B9] font-medium drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]"
        >
          {weddingEventConfig.dateDisplay} &bull; {weddingEventConfig.venueCity}
        </motion.p>
      </div>

      <motion.div
        style={{
          transform: `translate3d(${mousePos.x * 20}px, ${mousePos.y * 20}px, 0)`,
          transition: 'transform 0.1s ease-out',
        }}
        className="relative z-10 text-center max-w-5xl mx-auto px-4 my-auto"
      >
        <motion.h1
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.6, duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          className="font-serif text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-light tracking-tight leading-[0.9] text-[#FAF8F5] mb-6 drop-shadow-[0_6px_30px_rgba(0,0,0,0.85)]"
        >
          Ndumiso <span className="italic font-light text-[#E8D3B9]">&amp;</span>{' '}
          <br className="md:hidden" /> Sithandiwe
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="font-serif italic text-xl sm:text-2xl md:text-3xl text-[#FAF8F5]/95 max-w-lg mx-auto font-light drop-shadow-[0_2px_16px_rgba(0,0,0,0.9)]"
        >
          &ldquo;Two souls, a single timeless journey.&rdquo;
        </motion.p>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="relative z-10 mb-6 sm:mb-8 flex flex-col items-center gap-3"
      >
        <MagneticWrapper>
          <button
            type="button"
            onClick={() => navigate('/journey')}
            className="group relative inline-flex items-center gap-4 px-8 py-4 bg-[#0A0A0A]/55 hover:bg-[#FAF8F5]/15 border border-[#FAF8F5]/40 rounded-full backdrop-blur-md transition-all duration-500 hover:border-[#E8D3B9] hover:pr-10 cursor-pointer shadow-[0_10px_30px_rgba(0,0,0,0.6)]"
          >
            <span className="text-xs uppercase tracking-[0.25em] text-[#FAF8F5] group-hover:text-[#E8D3B9] transition-colors">
              Explore Our Story
            </span>
            <ArrowRight className="w-4 h-4 text-[#E8D3B9] transition-transform duration-500 group-hover:translate-x-2" />
          </button>
        </MagneticWrapper>

        {/* Direct RSVP Button */}
        <MagneticWrapper>
          <button
            type="button"
            onClick={() => navigate('/rsvp')}
            className="group inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full bg-[#E8D3B9]/15 hover:bg-[#E8D3B9] border border-[#E8D3B9]/45 hover:border-[#E8D3B9] backdrop-blur-md transition-all duration-500 cursor-pointer shadow-[0_6px_25px_rgba(0,0,0,0.4)]"
            aria-label="RSVP For Wedding"
          >
            <span className="font-sans text-[10px] uppercase tracking-[0.3em] font-medium text-[#E8D3B9] group-hover:text-ink transition-colors duration-300">
              RSVP For Wedding
            </span>
            <Heart className="w-3 h-3 text-[#E8D3B9] group-hover:text-ink group-hover:scale-110 transition-all duration-300 fill-current" />
          </button>
        </MagneticWrapper>
      </motion.div>
    </motion.div>
  );
};
