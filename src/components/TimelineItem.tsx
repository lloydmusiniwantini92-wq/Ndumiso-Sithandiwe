import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart } from 'lucide-react';
import { MagneticWrapper } from './MagneticWrapper';
import { JourneyItem } from '../data/weddingData';

export const TimelineItem: React.FC<{ item: JourneyItem; index: number }> = ({
  item,
  index,
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(item.likes);
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleLike = () => {
    setLikesCount((prev: number) => (isLiked ? prev - 1 : prev + 1));
    setIsLiked(!isLiked);
  };

  const isEven = index % 2 === 0;

  return (
    <div
      className={`w-full flex flex-col ${
        isEven ? 'md:flex-row' : 'md:flex-row-reverse'
      } items-center justify-between gap-12 md:gap-24 my-28 md:my-44 relative z-10 max-w-[80rem] mx-auto px-6`}
    >
      {/* Central Connecting Stem Line */}
      <div className="absolute left-1/2 top-[-25%] bottom-[-25%] w-px bg-ink/10 -translate-x-1/2 hidden md:block z-0 pointer-events-none">
        <div className="w-full h-full bg-gradient-to-b from-transparent via-[#DFB78C]/35 to-transparent blur-[1px]" />
      </div>

      {/* Central Dot Node */}
      <div className="hidden md:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none">
        <div className="absolute -inset-2 rounded-full bg-[#DFB78C]/25 blur-[4px]" />
        <div className="w-4 h-4 rounded-full bg-ink border-[3px] border-paper shadow-xl relative z-10" />
      </div>

      {/* Massive Background Number */}
      <div
        className={`absolute top-1/2 -translate-y-1/2 ${
          isEven
            ? 'right-0 md:right-auto md:left-[55%]'
            : 'left-0 md:left-auto md:right-[55%]'
        } text-[12rem] md:text-[20rem] font-serif italic leading-none text-ink/[0.03] select-none pointer-events-none z-0`}
      >
        0{index + 1}
      </div>

      {/* Image Block (Expanding) */}
      <motion.div
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`relative z-40 cursor-pointer ${
          isExpanded ? 'w-full h-[75vh]' : 'w-full md:w-[45%] aspect-[4/5]'
        }`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div
          className={`relative w-full h-full rounded-[2rem] overflow-hidden group shadow-2xl bg-paper will-change-transform ${
            isExpanded ? 'border border-ink/5' : ''
          }`}
        >
          <img
            src={item.image}
            alt={item.date}
            loading="lazy"
            className={`w-full h-full transition-transform duration-700 ${
              isExpanded
                ? 'object-cover object-[center_20%]'
                : 'object-cover object-[center_20%] group-hover:scale-105'
            }`}
            referrerPolicy="no-referrer"
          />
          {/* Subtle Hover Overlay */}
          {!isExpanded && (
            <div className="absolute inset-0 bg-ink/0 transition-colors duration-500 group-hover:bg-ink/10 flex items-center justify-center pointer-events-none">
              <span className="font-sans text-[10px] tracking-[0.4em] uppercase text-paper opacity-0 group-hover:opacity-100 transition-opacity duration-500 font-bold backdrop-blur-md px-6 py-3 rounded-full border border-paper/30">
                View Full
              </span>
            </div>
          )}
          {/* Expanded Close Overlay */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.2 }}
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
        </div>
      </motion.div>

      {/* Text Content Block */}
      <AnimatePresence>
        {!isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className={`w-full md:w-[45%] relative z-30 flex flex-col ${
              isEven ? 'items-start' : 'items-end text-right'
            }`}
          >
            <div className="bg-paper p-10 md:p-14 shadow-xl border border-ink/5 rounded-[2rem] w-full relative overflow-hidden group">
              <div
                className="absolute inset-0 opacity-[0.02] pointer-events-none"
                style={{
                  backgroundImage:
                    'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22/%3E%3C/svg%3E")',
                }}
              />

              <div
                className={`flex items-center gap-4 mb-8 ${
                  isEven ? 'justify-start' : 'justify-end'
                }`}
              >
                {isEven && <div className="w-12 h-px bg-ink/30" />}
                <h2 className="font-sans text-[11px] md:text-xs tracking-[0.45em] uppercase text-ink/80 font-bold">
                  {item.date}
                </h2>
                {!isEven && <div className="w-12 h-px bg-ink/30" />}
              </div>

              {item.subtitle && (
                <h3 className="font-serif text-4xl md:text-5xl mb-6 text-ink italic leading-tight font-normal">
                  {item.subtitle}
                </h3>
              )}

              <p className="font-serif text-lg md:text-2xl leading-[1.75] text-ink/90 mb-10 font-light">
                {item.text}
              </p>

              <div
                className={`flex items-center gap-4 ${
                  isEven ? 'justify-start' : 'justify-end'
                }`}
              >
                <MagneticWrapper>
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.85 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLike();
                    }}
                    className={`transition-all duration-300 p-3 rounded-full border cursor-pointer ${
                      isLiked
                        ? 'border-rose-400/30 text-rose-500 bg-rose-50'
                        : 'border-ink/15 text-ink/40 hover:border-ink/50 hover:text-ink'
                    }`}
                  >
                    <Heart
                      className={`w-6 h-6 transition-all duration-300 ${
                        isLiked ? 'fill-current scale-110' : ''
                      }`}
                      strokeWidth={1.5}
                    />
                  </motion.button>
                </MagneticWrapper>
                <span className="font-sans text-[10px] tracking-[0.35em] text-ink/60 mt-1 font-bold">
                  {likesCount} LIKES
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
