import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Volume2, VolumeX } from 'lucide-react';
import { useAudio } from '../context/AudioContext';
import { MagneticWrapper } from './MagneticWrapper';

export function Navigation() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isMuted, toggleMute } = useAudio();

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!isMenuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMenuOpen]);

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/journey', label: 'Journey' },
    { path: '/details', label: 'Details' },
  ];

  return (
    <>
      <nav className="fixed top-0 w-full z-50 px-6 py-8 flex items-center justify-between mix-blend-difference text-paper pointer-events-none">
        <MagneticWrapper>
          <Link
            to="/"
            className="font-sans text-[11px] tracking-[0.45em] uppercase font-semibold pointer-events-auto p-4 select-none hover:opacity-80 transition-opacity"
          >
            N &amp; S
          </Link>
        </MagneticWrapper>

        <div className="flex items-center gap-2 md:gap-4 pointer-events-auto">
          <div className="hidden md:flex gap-4 mr-4">
            {navLinks.map((link) => (
              <MagneticWrapper key={link.path}>
                <Link
                  to={link.path}
                  className={`font-sans text-[11px] tracking-[0.25em] uppercase font-medium transition-all hover:opacity-100 p-4 ${
                    location.pathname === link.path
                      ? 'opacity-100 border-b border-paper'
                      : 'opacity-60'
                  }`}
                >
                  {link.label}
                </Link>
              </MagneticWrapper>
            ))}
          </div>

          <MagneticWrapper>
            <button
              data-audio-btn="true"
              onClick={toggleMute}
              className="opacity-70 hover:opacity-100 transition-opacity p-4 cursor-pointer"
              aria-label={isMuted ? 'Unmute sound' : 'Mute sound'}
              title={isMuted ? 'Play Music' : 'Mute Music'}
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4 md:w-5 md:h-5" />
              ) : (
                <Volume2 className="w-4 h-4 md:w-5 md:h-5 text-[#E8D3B9]" />
              )}
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
