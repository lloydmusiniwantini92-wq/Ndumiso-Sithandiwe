import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { MagneticWrapper } from './MagneticWrapper';

export const Footer: React.FC<{ isDark?: boolean; bgImage?: string }> = ({
  isDark = false,
  bgImage,
}) => {
  const bgClass = isDark ? 'bg-ink' : 'bg-paper';
  const textClass = isDark ? 'text-paper' : 'text-ink';
  const borderClass = isDark ? 'border-paper/10' : 'border-ink/10';

  return (
    <footer
      className={`w-full relative flex flex-col items-center justify-between ${
        bgImage
          ? 'min-h-[90vh] md:min-h-screen pt-36 pb-3 md:pb-4'
          : 'pt-48 pb-48'
      } overflow-hidden ${!bgImage && bgClass} ${textClass} border-t ${borderClass}`}
    >
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
            style={{
              textShadow:
                '0 4px 30px rgba(0,0,0,0.9), 0 0 60px rgba(0,0,0,0.7)',
            }}
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
            style={{
              textShadow:
                '0 4px 30px rgba(0,0,0,0.9), 0 0 60px rgba(0,0,0,0.7)',
            }}
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
                x="0"
                y="0"
                width="1200"
                height="300"
                patternUnits="userSpaceOnUse"
                patternTransform="rotate(-12)"
              >
                <text
                  x="0"
                  y="120"
                  className="font-serif italic text-[4rem] fill-ink"
                >
                  Ndumiso &amp; Sithandiwe
                </text>
                <text
                  x="600"
                  y="270"
                  className="font-serif italic text-[4rem] fill-ink"
                >
                  Ndumiso &amp; Sithandiwe
                </text>
                <text
                  x="-600"
                  y="270"
                  className="font-serif italic text-[4rem] fill-ink"
                >
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
      <div className="relative z-20 w-full px-6 md:px-14 flex flex-col md:flex-row items-center justify-between py-2.5 text-paper">
        <div className="font-sans text-[8.5px] sm:text-[9.5px] md:text-[11px] tracking-[0.3em] md:tracking-[0.35em] uppercase font-medium text-paper/85 mb-3 md:mb-0 drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)]">
          &copy; 2026 Ndumiso &amp; Sithandiwe
        </div>
        <MagneticWrapper>
          <a
            href="https://arsonPixelz.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 md:gap-3 font-sans text-[8.5px] sm:text-[9.5px] md:text-[11px] tracking-[0.3em] md:tracking-[0.35em] uppercase text-paper/85 hover:text-paper transition-all p-1 drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)]"
          >
            <span className="font-light">Engineered by</span>
            <span className="font-bold tracking-[0.32em] md:tracking-[0.4em] relative overflow-hidden text-paper">
              arsonPixelz
              <span className="absolute bottom-0 left-0 w-full h-px bg-current -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out" />
            </span>
          </a>
        </MagneticWrapper>
      </div>
    </footer>
  );
};
