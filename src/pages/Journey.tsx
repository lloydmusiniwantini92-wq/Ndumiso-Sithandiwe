import React, { useRef } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
} from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { journeyData } from '../data/weddingData';
import { TimelineItem } from '../components/TimelineItem';
import { Footer } from '../components/Footer';

const tSettings = { duration: 1.4, ease: [0.76, 0, 0.24, 1] as const };
// NOTE: No `scale`/`transform` here, and `filter` is reset to 'none' once the
// entrance finishes. Any lingering filter/transform on the page wrapper turns
// `position: fixed` children into scrolling ones (breaks static backdrops).
const pageVariants = {
  initial: { opacity: 0, filter: 'blur(10px)' },
  animate: {
    opacity: 1,
    filter: 'blur(0px)',
    transitionEnd: { filter: 'none' },
  },
  exit: { opacity: 0, filter: 'blur(10px)' },
};

// --- Cinematic Chapters Backdrop ---------------------------------------------
// Rock-solid smooth reveal: fades in and settles gently from 1.05x to 1x without
// any vertical bobbing, spring jitter, or scroll resistance. Locks completely static.
const ChaptersBackdrop: React.FC<{
  targetRef: React.RefObject<HTMLElement | null>;
}> = ({ targetRef }) => {
  const reduceMotion = useReducedMotion();

  // 0 when section enters, 1 when it aligns at top
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start end', 'start start'],
  });
  const reveal = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 28,
    mass: 0.6,
    restDelta: 0.001,
  });

  const imageOpacity = useTransform(reveal, [0, 0.2, 1], [0, 0.45, 1]);
  const pushIn = useTransform(reveal, [0, 1], [1.05, 1]);
  const softFocus = useTransform(reveal, [0.2, 0.85], [1, 0]);
  const darkness = useTransform(reveal, [0, 0.85], [0.85, 0.1]);

  const imgSrc = '/photos/couple-embrace-direct.jpg';

  return (
    <div
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-ink"
      aria-hidden="true"
    >
      {/* Reveal layer: opacity + push-in */}
      <motion.div
        className="absolute inset-0 will-change-transform"
        style={
          reduceMotion
            ? { opacity: imageOpacity }
            : { opacity: imageOpacity, scale: pushIn }
        }
      >
        {/* Sharp plate */}
        <img
          src={imgSrc}
          alt=""
          decoding="async"
          className="couple-backdrop"
          style={{ filter: 'blur(1.5px) brightness(0.9) contrast(1.05)' }}
        />
        {/* Soft-focus plate (smoothly fades out as focus sharpens) */}
        {!reduceMotion && (
          <motion.img
            src={imgSrc}
            alt=""
            decoding="async"
            className="couple-backdrop"
            style={{ opacity: softFocus, filter: 'blur(12px) brightness(0.85)' }}
          />
        )}
      </motion.div>

      {/* Darkness veil: settles to a light 10% veil */}
      <motion.div
        className="absolute inset-0 bg-ink"
        style={{ opacity: darkness }}
      />

      {/* Cinematic vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(5,5,5,0.55)_100%)]" />

      {/* Film grain */}
      <div
        className="absolute inset-0 opacity-[0.04] mix-blend-overlay"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%221.5%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22/%3E%3C/svg%3E")',
        }}
      />
    </div>
  );
};

export const Journey: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '35%']);
  const heroScale = useTransform(scrollYProgress, [0, 0.6], [1, 1.1]);
  const chaptersRef = useRef<HTMLElement>(null);

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={tSettings}
      className="min-h-screen text-ink relative flex flex-col bg-paper"
    >
      {/* Luxury Materialistic White Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-paper">
        {/* Subtle noise texture */}
        <div
          className="absolute inset-0 opacity-[0.03] mix-blend-multiply pointer-events-none"
          style={{
            backgroundImage:
              'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%221.5%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22/%3E%3C/svg%3E")',
          }}
        />
      </div>

      <div className="relative h-screen w-full overflow-hidden flex flex-col items-center justify-end pb-2.5 sm:pb-3.5 md:pb-4 bg-ink shrink-0">
        <motion.div
          style={{ y: heroY, scale: heroScale }}
          className="absolute inset-0 z-0 w-full h-full will-change-transform"
        >
          <img
            src="/photos/couple-gazing-smile.jpg"
            alt="Ndumiso & Sithandiwe"
            className="w-full h-full object-cover brightness-[0.88] origin-top"
            style={{ objectPosition: 'center 8%' }}
          />
          <div className="absolute inset-0 bg-ink/15 z-10 pointer-events-none" />
        </motion.div>

        {/* Cinematic gradient cradle for high contrast and legibility */}
        <div className="absolute inset-x-0 bottom-0 h-[34rem] bg-gradient-to-t from-ink via-ink/75 to-transparent pointer-events-none z-10" />
        <div className="absolute inset-x-0 bottom-0 h-64 backdrop-blur-md [mask-image:linear-gradient(to_top,black,transparent)] pointer-events-none z-10" />

        <div className="relative z-20 text-center px-4 flex flex-col items-center pointer-events-none">
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 1.2 }}
            className="font-sans text-[10px] md:text-xs tracking-[0.55em] uppercase text-[#E8D3B9] font-medium mb-3 md:mb-4 drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)]"
          >
            A Story in Five Chapters
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, filter: 'blur(30px)', y: 40 }}
            animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
            transition={{ delay: 0.9, duration: 2.2, ease: [0.76, 0, 0.24, 1] }}
            className="font-serif text-6xl sm:text-8xl md:text-[9rem] lg:text-[10.5rem] xl:text-[11.5rem] px-4 leading-[0.8] tracking-[-0.04em] text-paper text-center drop-shadow-[0_25px_60px_rgba(0,0,0,0.95)]"
          >
            <span className="block opacity-95">The</span>
            <span className="italic font-light opacity-90 -mt-4 sm:-mt-6 md:-mt-8 lg:-mt-10 block">
              Chapters
            </span>
          </motion.h1>

          {/* Sleek Minimalistic Scroll Button */}
          <motion.button
            type="button"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.3 }}
            onClick={() =>
              chaptersRef.current?.scrollIntoView({ behavior: 'smooth' })
            }
            className="group mt-16 sm:mt-20 md:mt-24 flex flex-col items-center gap-2 cursor-pointer bg-transparent border-none outline-none focus:outline-none pointer-events-auto"
            aria-label="Scroll to chapters"
          >
            <span className="font-sans text-[9px] uppercase tracking-[0.45em] text-paper/75 group-hover:text-[#E8D3B9] transition-colors duration-300 font-medium">
              Explore
            </span>
            <div className="w-6 h-10 rounded-full border border-paper/30 group-hover:border-[#E8D3B9] flex items-start justify-center p-1.5 transition-colors duration-500 bg-ink/30 backdrop-blur-sm">
              <motion.div
                animate={{ y: [0, 10, 0], opacity: [0.4, 1, 0.4] }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                  ease: 'easeInOut',
                }}
                className="w-1 h-2 rounded-full bg-[#E8D3B9]"
              />
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[#E8D3B9]/75 group-hover:text-[#E8D3B9] group-hover:translate-y-1 transition-all duration-300 -mt-1" />
          </motion.button>
        </div>
      </div>

      {/* Permanent Chapters Timeline Section with Details Couple Image Background.
          clip-path: inset(0) makes this section a "window": the fixed image inside
          stays pinned to the viewport (static, like /details) but is only visible
          between the hero and the footer. */}
      <section
        ref={chaptersRef}
        className="relative w-full flex-grow bg-ink"
        style={{ clipPath: 'inset(0)' }}
      >
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
};
