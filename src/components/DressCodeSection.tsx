import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Check, X, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import {
  ladiesInspiration,
  gentsInspiration,
  colorPalette,
  LookbookItem,
} from '../data/weddingData';

export const DressCodeSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'ladies' | 'gentlemen'>('all');
  const [selectedLook, setSelectedLook] = useState<LookbookItem | null>(null);

  const allLooks = [...ladiesInspiration, ...gentsInspiration];

  // Lock background scroll and allow Escape key to close when Lookbook modal is open
  useEffect(() => {
    if (!selectedLook) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedLook(null);
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedLook]);

  const handleNavigateLook = (direction: 'prev' | 'next', e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedLook) return;
    const currentIndex = allLooks.findIndex((item) => item.id === selectedLook.id);
    if (currentIndex === -1) return;
    const nextIndex =
      direction === 'next'
        ? (currentIndex + 1) % allLooks.length
        : (currentIndex - 1 + allLooks.length) % allLooks.length;
    setSelectedLook(allLooks[nextIndex]);
  };

  const renderLookCard = (item: LookbookItem, index: number) => (
    <motion.div
      key={item.id}
      initial={{ opacity: 0, y: 35, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{
        duration: 0.85,
        delay: index * 0.1,
        ease: [0.16, 1, 0.3, 1],
      }}
      onClick={() => setSelectedLook(item)}
      className="group relative cursor-pointer overflow-hidden rounded-2xl border border-[#E8D3B9]/25 bg-ink/80 aspect-[3/4] shadow-2xl hover:border-[#E8D3B9]/70 transition-all duration-700"
    >
      {/* Editorial Look Badge */}
      <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 px-3 py-1 bg-ink/75 backdrop-blur-md border border-[#E8D3B9]/30 rounded-full">
        <span className="font-sans text-[9px] uppercase tracking-[0.28em] text-[#E8D3B9] font-semibold">
          Look {item.lookNumber}
        </span>
      </div>

      {/* Expand Icon Badge */}
      <div className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-ink/75 backdrop-blur-md border border-[#E8D3B9]/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-1 group-hover:translate-y-0">
        <Eye className="w-3.5 h-3.5 text-[#E8D3B9]" />
      </div>

      {/* Image */}
      <img
        src={item.image}
        alt={item.title}
        loading="lazy"
        decoding="async"
        className="w-full h-full object-cover object-top transition-transform duration-1000 ease-out group-hover:scale-105"
      />

      {/* Gradient Overlay for Text Legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent opacity-90 group-hover:opacity-95 transition-opacity duration-500" />

      {/* Bottom Caption Panel */}
      <div className="absolute bottom-0 inset-x-0 p-4 md:p-5 flex flex-col justify-end translate-y-1 group-hover:translate-y-0 transition-transform duration-500 text-center">
        <p className="font-sans text-[9px] uppercase tracking-[0.25em] text-[#E8D3B9] mb-1 font-medium">
          {item.subtitle}
        </p>
        <h5 className="font-serif text-lg md:text-xl text-paper tracking-wide leading-snug">
          {item.title}
        </h5>
        <p className="font-sans text-[10.5px] text-paper/75 font-light leading-relaxed mt-2 line-clamp-2 opacity-0 max-h-0 group-hover:opacity-100 group-hover:max-h-16 transition-all duration-500">
          {item.stylingNote}
        </p>
      </div>
    </motion.div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
      className="w-full mb-28 relative z-10"
    >
      {/* Translucent Glass Container matching the original Details aesthetic */}
      <div className="relative overflow-hidden rounded-3xl bg-ink/60 backdrop-blur-md border border-[#E8D3B9]/25 p-6 sm:p-10 md:p-14 shadow-2xl">
        {/* Delicate inner gold border */}
        <div className="absolute inset-3 border border-[#E8D3B9]/15 rounded-2xl pointer-events-none" />

        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 relative z-10">
          <div className="flex flex-col items-center gap-3 mb-4">
            <div className="w-2.5 h-2.5 rounded-full bg-[#E8D3B9] shadow-[0_0_12px_#E8D3B9]" />
            <span className="font-sans text-[10.5px] tracking-[0.45em] uppercase font-bold text-[#E8D3B9]">
              Sartorial Mandate &amp; Vision Board
            </span>
          </div>

          <h2 className="font-serif text-5xl sm:text-6xl md:text-7xl italic font-light text-paper mb-6">
            The Dress Code
          </h2>

          <div className="w-20 h-px bg-[#E8D3B9]/40 mx-auto mb-8" />

          {/* Primary Mandate Card */}
          <div className="bg-ink/65 border border-[#E8D3B9]/30 p-6 md:p-8 rounded-2xl shadow-xl">
            <p className="font-serif text-xl sm:text-2xl md:text-3xl text-paper leading-relaxed font-light italic">
              &ldquo;We kindly request that you dress in{' '}
              <span className="text-[#E8D3B9] font-normal">
                formal black-tie attire
              </span>{' '}
              limited to{' '}
              <span className="underline decoration-[#E8D3B9]/70 underline-offset-8 font-normal not-italic tracking-wider">
                BLACK
              </span>{' '}
              as the main garment.&rdquo;
            </p>
          </div>
        </div>

        {/* Interactive Color Palette Bar — Zero Truncation */}
        <div className="mb-12 relative z-10">
          <p className="text-center font-sans text-[10px] uppercase tracking-[0.35em] text-[#E8D3B9]/90 mb-5 font-semibold">
            Approved Sartorial Palette
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 max-w-4xl mx-auto">
            {colorPalette.map((swatch) => (
              <div
                key={swatch.name}
                className="flex items-center gap-3.5 px-4 py-3.5 rounded-2xl bg-ink/70 border border-[#E8D3B9]/25 hover:border-[#E8D3B9]/60 transition-colors"
              >
                <span
                  className="w-8 h-8 rounded-full shrink-0 shadow-md"
                  style={{
                    backgroundColor: swatch.hex,
                    border: `1.5px solid ${swatch.border}`,
                  }}
                />
                <div className="text-left">
                  <p className="font-sans text-[11px] font-medium text-paper tracking-wider leading-snug">
                    {swatch.name}
                  </p>
                  <p className="font-sans text-[9.5px] text-[#E8D3B9]/85 tracking-wide leading-snug mt-0.5">
                    {swatch.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex justify-center mb-12 relative z-10">
          <div className="inline-flex flex-wrap justify-center items-center gap-2 bg-paper/5 border border-paper/15 p-1.5 rounded-full backdrop-blur-md">
            {(
              [
                { id: 'all', label: 'Complete Vision Board' },
                { id: 'ladies', label: "Ladies' Guide" },
                { id: 'gentlemen', label: "Gentlemen's Guide" },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-2.5 font-sans text-[10px] uppercase tracking-[0.25em] rounded-full transition-all duration-300 cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-[#E8D3B9] text-ink font-bold shadow-[0_0_20px_rgba(232,211,185,0.35)]'
                    : 'text-paper/75 hover:text-paper'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* Ladies Section */}
          {(activeTab === 'all' || activeTab === 'ladies') && (
            <motion.div
              key="ladies-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.45 }}
              className="mb-14 relative z-10"
            >
              <div className="bg-ink/55 border border-[#E8D3B9]/20 p-6 sm:p-8 md:p-10 rounded-2xl">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 pb-5 border-b border-[#E8D3B9]/20 gap-4">
                  <div>
                    <span className="font-sans text-[10px] uppercase tracking-[0.35em] text-[#E8D3B9] block mb-2 font-semibold">
                      For Her &bull; Floor-Length Black Couture
                    </span>
                    <h3 className="font-serif text-3xl md:text-4xl italic text-paper font-light">
                      For The Ladies
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1.5 font-sans text-[9.5px] uppercase tracking-[0.2em] px-3.5 py-1.5 rounded-full bg-ink/80 border border-[#E8D3B9]/35 text-paper">
                      <Check className="w-3 h-3 text-[#E8D3B9]" /> Black Main Garment
                    </span>
                    <span className="inline-flex items-center gap-1.5 font-sans text-[9.5px] uppercase tracking-[0.2em] px-3.5 py-1.5 rounded-full bg-ink/80 border border-[#E8D3B9]/35 text-[#E8D3B9]">
                      <Check className="w-3 h-3 text-[#E8D3B9]" /> Gold or Silver Accents
                    </span>
                  </div>
                </div>

                <p className="font-sans text-[11px] md:text-xs leading-loose text-[#F5EDE4]/90 tracking-[0.16em] mb-8 max-w-3xl">
                  You are welcome to accessorise your outfit with{' '}
                  <span className="text-[#E8D3B9] font-semibold">
                    silver or gold accessories
                  </span>{' '}
                  that compliment a clean, elegant look. Feel free to draw some
                  inspiration from the styles shown on the vision board. You can
                  wear anything that aligns with the sophisticated dress code.
                </p>

                {/* 4-Image Vision Grid for Ladies */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {ladiesInspiration.map((item, idx) => renderLookCard(item, idx))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Gentlemen Section */}
          {(activeTab === 'all' || activeTab === 'gentlemen') && (
            <motion.div
              key="gents-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.45 }}
              className="mb-10 relative z-10"
            >
              <div className="bg-ink/55 border border-[#E8D3B9]/20 p-6 sm:p-8 md:p-10 rounded-2xl">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 pb-5 border-b border-[#E8D3B9]/20 gap-4">
                  <div>
                    <span className="font-sans text-[10px] uppercase tracking-[0.35em] text-[#E8D3B9] block mb-2 font-semibold">
                      For Him &bull; Bespoke Evening Tailoring
                    </span>
                    <h3 className="font-serif text-3xl md:text-4xl italic text-paper font-light">
                      For The Gentlemen
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1.5 font-sans text-[9.5px] uppercase tracking-[0.2em] px-3.5 py-1.5 rounded-full bg-ink/80 border border-[#E8D3B9]/35 text-paper">
                      <Check className="w-3 h-3 text-[#E8D3B9]" /> Black Suit or Tuxedo
                    </span>
                    <span className="inline-flex items-center gap-1.5 font-sans text-[9.5px] uppercase tracking-[0.2em] px-3.5 py-1.5 rounded-full bg-ink/80 border border-[#E8D3B9]/35 text-paper">
                      <Check className="w-3 h-3 text-[#E8D3B9]" /> White Shirt Welcome
                    </span>
                    <span className="inline-flex items-center gap-1.5 font-sans text-[9.5px] uppercase tracking-[0.2em] px-3.5 py-1.5 rounded-full bg-ink/80 border border-[#E8D3B9]/35 text-[#E8D3B9]">
                      <Check className="w-3 h-3 text-[#E8D3B9]" /> Bowtie or Tie
                    </span>
                  </div>
                </div>

                <p className="font-sans text-[11px] md:text-xs leading-loose text-[#F5EDE4]/90 tracking-[0.16em] mb-8 max-w-3xl">
                  Wear your{' '}
                  <span className="text-[#E8D3B9] font-semibold">
                    black suit or tuxedo
                  </span>
                  .{' '}
                  <span className="text-paper font-semibold">
                    White shirts are welcome
                  </span>
                  , paired with your formal suit, complete with a{' '}
                  <span className="text-[#E8D3B9] font-semibold">
                    bowtie or tie
                  </span>
                  .
                </p>

                {/* 4-Image Vision Grid for Gentlemen */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {gentsInspiration.map((item, idx) => renderLookCard(item, idx))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Closing Gratitude Note */}
        <div className="flex flex-col items-center text-center gap-3 pt-6 border-t border-[#E8D3B9]/20 w-full max-w-lg mx-auto relative z-10">
          <p className="font-sans text-[10.5px] md:text-[11.5px] uppercase tracking-[0.3em] text-[#E8D3B9] font-medium leading-relaxed">
            Thank you for helping us create a stunning and harmonious
            celebration!
          </p>
          <div className="font-serif text-2xl italic text-[#E8D3B9]/60 select-none">
            N &amp; S
          </div>
        </div>
      </div>

      {/* Portal-rendered Lightbox Modal at document.body with Universal High z-index (z-[999]) */}
      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {selectedLook && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedLook(null)}
                className="fixed inset-0 z-[999] bg-ink/90 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-6 md:p-8 cursor-zoom-out"
              >
                <motion.div
                  initial={{ scale: 0.92, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.92, opacity: 0, y: 20 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  onClick={(e) => e.stopPropagation()}
                  className="relative max-w-3xl w-full max-h-[86vh] md:max-h-[90vh] overflow-y-auto md:overflow-hidden bg-[#0E0E0E] border border-[#E8D3B9]/40 rounded-3xl shadow-[0_30px_100px_rgba(0,0,0,0.95)] grid grid-cols-1 md:grid-cols-12 cursor-default"
                >
                  {/* Close button — Positioned in top-right of modal card */}
                  <button
                    type="button"
                    onClick={() => setSelectedLook(null)}
                    className="absolute top-4 right-4 z-30 w-9 h-9 rounded-full bg-ink/85 border border-[#E8D3B9]/40 flex items-center justify-center text-paper hover:text-[#E8D3B9] hover:border-[#E8D3B9] transition-colors cursor-pointer shadow-lg"
                    aria-label="Close lookbook preview"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  {/* Image Column */}
                  <div className="md:col-span-7 relative bg-ink aspect-[3/4] md:aspect-auto md:min-h-[520px]">
                    <img
                      src={selectedLook.image}
                      alt={selectedLook.title}
                      className="w-full h-full object-cover object-top"
                    />
                    {/* Prev / Next Controls */}
                    <button
                      type="button"
                      onClick={(e) => handleNavigateLook('prev', e)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-ink/80 border border-[#E8D3B9]/35 flex items-center justify-center text-paper hover:bg-[#E8D3B9] hover:text-ink transition-colors cursor-pointer"
                      aria-label="Previous look"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleNavigateLook('next', e)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-ink/80 border border-[#E8D3B9]/35 flex items-center justify-center text-paper hover:bg-[#E8D3B9] hover:text-ink transition-colors cursor-pointer"
                      aria-label="Next look"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Editorial Details Column */}
                  <div className="md:col-span-5 p-6 sm:p-8 flex flex-col justify-between bg-[#0E0E0E]">
                    <div>
                      <div className="pr-11 mb-4">
                        <span className="inline-block font-sans text-[9px] uppercase tracking-[0.26em] text-[#E8D3B9] px-3.5 py-1.5 rounded-full border border-[#E8D3B9]/30 bg-ink leading-relaxed">
                          {selectedLook.category === 'ladies'
                            ? "Ladies' Lookbook"
                            : "Gentlemen's Lookbook"}{' '}
                          &bull; Look {selectedLook.lookNumber}
                        </span>
                      </div>
                      <h4 className="font-serif text-2xl sm:text-3xl text-paper mb-2">
                        {selectedLook.title}
                      </h4>
                      <p className="font-sans text-[10.5px] uppercase tracking-[0.22em] text-[#E8D3B9] mb-6">
                        {selectedLook.subtitle}
                      </p>
                      <div className="w-10 h-px bg-[#E8D3B9]/30 mb-6" />
                      <p className="font-sans text-xs text-paper/85 font-light leading-relaxed mb-6">
                        {selectedLook.stylingNote}
                      </p>
                    </div>

                    <div className="pt-6 border-t border-[#E8D3B9]/20">
                      <p className="font-sans text-[9.5px] uppercase tracking-[0.25em] text-[#E8D3B9]/80 mb-2 font-semibold">
                        Dress Code Alignment
                      </p>
                      <p className="font-sans text-[11px] text-paper/70 font-light leading-relaxed">
                        {selectedLook.category === 'ladies'
                          ? 'Formal black main garment elevated with refined gold or silver metallic accents.'
                          : 'Formal black suit or tuxedo paired with a crisp white dress shirt and black bowtie or necktie.'}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </motion.div>
  );
};
