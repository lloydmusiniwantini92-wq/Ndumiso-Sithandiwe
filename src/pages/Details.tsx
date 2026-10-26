import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams, useLocation, Link } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Heart,
  ArrowRight,
  X,
  Navigation as NavigationIcon,
  ExternalLink,
  CheckCircle2,
  UserCheck,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { MagneticWrapper } from '../components/MagneticWrapper';
import { DressCodeSection } from '../components/DressCodeSection';
import { weddingEventConfig } from '../data/weddingData';
import {
  verifyGuestName,
  smartMatchGuests,
  getActiveGuestList,
  syncWithGoogleSheets,
  submitGuestRsvp,
  GuestEntry,
} from '../data/guestListData';

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

export const Details: React.FC = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const [guestList, setGuestList] = useState<GuestEntry[]>(() =>
    getActiveGuestList()
  );
  const [isRsvpModalOpen, setIsRsvpModalOpen] = useState(false);
  const [rsvpData, setRsvpData] = useState({
    name: '',
    phone: '',
    attendance: 'attending',
    guests: '1',
    notes: '',
  });
  const [smartSuggestions, setSmartSuggestions] = useState<GuestEntry[]>([]);
  const [refusalError, setRefusalError] = useState<string | null>(null);
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mapColorMode, setMapColorMode] = useState<'editorial' | 'standard'>(
    'editorial'
  );
  const submittingLockRef = useRef(false);

  // Sync live guest list and RSVP statuses
  useEffect(() => {
    const refreshLocal = () => setGuestList(getActiveGuestList());
    window.addEventListener('ns-guest-list-updated', refreshLocal);
    syncWithGoogleSheets().then(({ guests }) => {
      setGuestList(guests);
    });
    return () =>
      window.removeEventListener('ns-guest-list-updated', refreshLocal);
  }, []);

  const verification = useMemo(
    () => verifyGuestName(rsvpData.name, guestList),
    [rsvpData.name, guestList]
  );

  // Auto-open RSVP modal if query param ?rsvp=true or hash #rsvp is provided
  useEffect(() => {
    if (searchParams.get('rsvp') === 'true' || location.hash === '#rsvp') {
      setIsRsvpModalOpen(true);
    }
  }, [searchParams, location.hash]);

  // Lock background page scroll and support Escape key when RSVP modal is open
  useEffect(() => {
    if (!isRsvpModalOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsRsvpModalOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isRsvpModalOpen]);

  const handleNameChange = (val: string) => {
    setRefusalError(null);
    setRsvpData((prev) => ({ ...prev, name: val }));

    if (val.trim().length >= 2) {
      const matches = smartMatchGuests(val, 4, guestList);
      setSmartSuggestions(matches);
    } else {
      setSmartSuggestions([]);
    }
  };

  const handleSelectGuest = (guest: GuestEntry) => {
    setRsvpData((prev) => ({
      ...prev,
      name: guest.name,
      phone: prev.phone || guest.phone || '',
      guests: guest.rsvpGuests
        ? String(guest.rsvpGuests)
        : guest.allowedGuests
        ? String(guest.allowedGuests)
        : prev.guests,
      attendance:
        guest.rsvpStatus === 'declining' ? 'declining' : prev.attendance,
      notes: prev.notes || guest.rsvpNotes || '',
    }));
    setSmartSuggestions([]);
    setRefusalError(null);
  };

  const executeSubmission = async () => {
    if (submittingLockRef.current) return;
    submittingLockRef.current = true;
    setIsSubmitting(true);

    try {
      await submitGuestRsvp(rsvpData);
      setGuestList(getActiveGuestList());
    } finally {
      setIsSubmitting(false);
      setRsvpSubmitted(true);
      submittingLockRef.current = false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (submittingLockRef.current || isSubmitting) return;
    setRefusalError(null);

    // 1. Strict Whitelist Verification (Client-side refusal):
    if (!verification.isVerified) {
      setRefusalError(
        `"${rsvpData.name}" was not found on the invited wedding guest list. RSVPs are strictly reserved for invited guests. Please check your spelling or contact the couple directly.`
      );
      return; // STRICT REFUSAL: NEVER SUBMITS
    }

    // 2. Strict Phone Validation (reject letters or garbage strings):
    const cleanPhone = rsvpData.phone.replace(/[\s\-\+\(\)]/g, '');
    if (!/^\d{7,15}$/.test(cleanPhone)) {
      setRefusalError(
        'Please enter a valid phone or WhatsApp number (digits only, at least 7 digits).'
      );
      return; // STRICT REFUSAL: NEVER SUBMITS
    }

    // 3. Authorized submission:
    executeSubmission();
  };

  const alreadyRsvpedGuest =
    verification.isVerified &&
    verification.matchedGuest?.rsvpStatus &&
    verification.matchedGuest.rsvpStatus !== 'pending'
      ? verification.matchedGuest
      : null;

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={tSettings}
      className="min-h-screen bg-ink text-paper relative"
    >
      {/* SVG Filter for Torn Paper Edges */}
      <svg className="hidden">
        <filter id="torn-paper" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.04"
            numOctaves="5"
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="40"
            xChannelSelector="R"
            yChannelSelector="G"
          />
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
            className={`hidden md:block absolute ${pos} w-[34rem] h-[34rem] pointer-events-none transform ${rot}`}
            style={{ mixBlendMode: 'lighten' }}
          >
            {/* Soft halo (depth) */}
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="#3a342e"
              strokeWidth="0.7"
              strokeLinecap="round"
              className="absolute inset-0 w-full h-full"
              style={{ filter: 'blur(5px)' }}
            >
              <path d="M12 22V8" />
              <path d="M12 8c-3-3-8-2-8-2s1 5 4 8c2 2 4 2 4 2" />
              <path d="M12 8c3-3 8-2 8-2s-1 5-4 8c-2 2-4 2-4 2" />
              <path d="M12 12c-2-2-5-1-5-1s1 3 3 5" />
              <path d="M12 12c2-2 5-1 5-1s-1 3-3 5" />
            </svg>
            {/* Crisp engraved line */}
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="#6e6052"
              strokeWidth="0.16"
              strokeLinecap="round"
              className="absolute inset-0 w-full h-full"
            >
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
            maskImage:
              'radial-gradient(ellipse 120% 140% at 50% 40%, transparent 64%, black 88%)',
            WebkitMaskImage:
              'radial-gradient(ellipse 120% 140% at 50% 40%, transparent 64%, black 88%)',
            filter: 'url(#torn-paper)',
          }}
        />

        {/* Layer 3: Paper Texture / Grain */}
        <div
          className="absolute inset-0 opacity-[0.15] mix-blend-overlay pointer-events-none z-20 translate-z-0"
          style={{
            backgroundImage:
              'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%221.8%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22/%3E%3C/svg%3E")',
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-[80rem] mx-auto px-6 md:px-12 lg:px-24 pt-24 pb-6 md:pb-8 flex flex-col">
        {/* Hero Section */}
        <div className="flex flex-col items-center justify-start min-h-[85vh] text-center pt-8">
          {/* Top Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.2 }}
            className="font-serif text-[5rem] md:text-[8.5rem] leading-[0.85] mb-auto tracking-tighter drop-shadow-xl"
          >
            The <br />
            <span className="italic font-light text-[#F3E5D8] opacity-95 pr-8">
              Details
            </span>
          </motion.h1>

          {/* Bottom Content Block */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 0.8 }}
            className="flex flex-col items-center gap-6 mt-auto mb-10 w-full max-w-2xl mx-auto py-12 relative"
          >
            {/* Dark Radial Gradient Backdrop for Legibility */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-ink/75 via-ink/30 to-transparent pointer-events-none -z-10" />

            <div className="w-32 h-px bg-[#E8D3B9]/50" />
            <p
              className="font-sans text-[10px] md:text-[11px] tracking-[0.45em] uppercase text-[#E8D3B9] font-semibold"
              style={{ textShadow: '0 2px 10px rgba(0,0,0,0.9)' }}
            >
              {weddingEventConfig.dateDisplay} &bull;{' '}
              {weddingEventConfig.venueCity}
            </p>
            <h2
              className="font-serif text-3xl md:text-5xl italic font-light text-[#E8D3B9]"
              style={{
                textShadow:
                  '0 4px 20px rgba(0,0,0,0.8), 0 2px 4px rgba(0,0,0,0.8)',
              }}
            >
              A Celebration of Love
            </h2>
            <p
              className="font-sans text-[11px] md:text-xs tracking-[0.45em] uppercase text-[#F5EDE4]/90 leading-loose px-4 font-medium"
              style={{ textShadow: '0 2px 10px rgba(0,0,0,0.9)' }}
            >
              Join us as we unite our families and embark on life&apos;s
              greatest chapter. Black tie strictly required.
            </p>
          </motion.div>

          {/* Itinerary Anchor */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 1.2 }}
            className="flex flex-col items-center gap-4 mt-4"
          >
            <div className="w-3 h-3 rounded-full bg-[#E8D3B9] shadow-[0_0_15px_#E8D3B9]" />
            <span
              className="font-sans text-[11px] tracking-[0.45em] uppercase font-bold text-[#E8D3B9]"
              style={{
                textShadow:
                  '0 2px 10px rgba(0,0,0,0.9), 0 0 4px rgba(0,0,0,0.8)',
              }}
            >
              Itinerary
            </span>
          </motion.div>
        </div>

        {/* High-end 2 Column Split Grid */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 gap-24 md:gap-16 mb-28 relative text-paper"
          style={{
            textShadow: '0 4px 15px rgba(0,0,0,0.9), 0 0 5px rgba(0,0,0,0.8)',
          }}
        >
          {/* Divider vertical on desktop */}
          <div className="hidden md:block absolute top-0 bottom-0 left-1/2 w-[1px] bg-[#E8D3B9]/30 -translate-x-1/2 shadow-xl" />
          <div className="md:hidden absolute top-[45%] left-[20%] right-[20%] h-[1px] bg-[#E8D3B9]/30 shadow-xl" />

          {/* Ceremony */}
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center text-center md:pr-12 lg:pr-24"
          >
            <h2 className="font-serif text-4xl mb-8 italic text-[#E8D3B9]">
              01.
            </h2>
            <h3 className="font-serif text-5xl md:text-6xl mb-6 leading-tight text-paper">
              The Ceremony <br />
              <span className="italic font-light text-4xl md:text-5xl text-[#F3E5D8]">
                Lakeside Events
              </span>
            </h3>
            <p className="font-sans text-[11px] text-[#F5EDE4]/90 leading-loose mb-12 uppercase tracking-[0.25em]">
              Along Plumtree Road (14km from CBD)
              <br />
              Bulawayo, Zimbabwe &bull; 30 December 2026
            </p>
            <p className="font-serif text-4xl border-t border-[#E8D3B9]/40 pt-6 inline-block w-2/3 text-[#F3E5D8]">
              {weddingEventConfig.ceremonyTime}
            </p>
          </motion.div>

          {/* Reception */}
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{
              duration: 1.0,
              delay: 0.15,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="flex flex-col items-center text-center md:pl-12 lg:pl-24"
          >
            <h2 className="font-serif text-4xl mb-8 italic text-[#E8D3B9]">
              02.
            </h2>
            <h3 className="font-serif text-5xl md:text-6xl mb-6 leading-tight text-paper">
              The Reception <br />
              <span className="italic font-light text-4xl md:text-5xl text-[#F3E5D8]">
                Grand Pavilion
              </span>
            </h3>
            <p className="font-sans text-[11px] text-[#F5EDE4]/90 leading-loose mb-12 uppercase tracking-[0.25em]">
              Lakeside Events Centre, Plumtree Road
              <br />
              Bulawayo, Zimbabwe &bull; 30 December 2026
            </p>
            <p className="font-serif text-4xl border-t border-[#E8D3B9]/40 pt-6 inline-block w-2/3 text-[#F3E5D8]">
              {weddingEventConfig.receptionTime}
            </p>
          </motion.div>
        </div>

        {/* Interactive Google Maps Section for Lakeside Events Centre, Bulawayo */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          className="w-full mb-28 relative z-10"
        >
          <div className="bg-ink/60 backdrop-blur-md border border-[#E8D3B9]/25 rounded-3xl p-6 sm:p-10 md:p-12 shadow-2xl relative overflow-hidden">
            {/* Delicate inner gold border */}
            <div className="absolute inset-2.5 border border-[#E8D3B9]/15 rounded-2xl pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
              <div>
                <div className="flex items-center gap-2.5 text-[#E8D3B9] font-sans text-[10px] uppercase tracking-[0.4em] font-bold mb-3">
                  <NavigationIcon className="w-3.5 h-3.5" />
                  <span>Location &amp; Directions</span>
                </div>
                <h3 className="font-serif text-3xl sm:text-4xl md:text-5xl italic font-light text-paper">
                  {weddingEventConfig.venueName}, Bulawayo
                </h3>
                <p className="font-sans text-[11px] tracking-[0.22em] uppercase text-[#F5EDE4]/80 mt-2">
                  {weddingEventConfig.venueAddress} &bull;{' '}
                  {weddingEventConfig.venueCity}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setMapColorMode((prev) =>
                      prev === 'editorial' ? 'standard' : 'editorial'
                    )
                  }
                  className="px-5 py-2.5 font-sans text-[9.5px] uppercase tracking-[0.25em] border border-[#E8D3B9]/35 bg-ink/80 text-paper/85 hover:border-[#E8D3B9] hover:text-[#E8D3B9] transition-colors rounded-full cursor-pointer"
                >
                  {mapColorMode === 'editorial'
                    ? 'Standard Map View'
                    : 'Editorial Dark Map'}
                </button>

                <a
                  href={weddingEventConfig.googleMapsDirectionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 px-6 py-2.5 font-sans text-[9.5px] uppercase tracking-[0.28em] bg-[#E8D3B9] text-ink font-bold rounded-full hover:bg-[#FAF8F5] transition-colors shadow-lg"
                >
                  <span>Open in Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            <div className="relative z-10 w-full h-[320px] sm:h-[400px] md:h-[440px] rounded-2xl overflow-hidden border border-[#E8D3B9]/30 bg-ink">
              <iframe
                title="Lakeside Events Centre Bulawayo Google Map"
                src={weddingEventConfig.googleMapsEmbedUrl}
                className="w-full h-full border-0 transition-all duration-700"
                style={{
                  filter:
                    mapColorMode === 'editorial'
                      ? 'invert(90%) hue-rotate(180deg) brightness(95%) contrast(92%) sepia(18%)'
                      : 'none',
                }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </div>
        </motion.div>

        {/* --- DRESS CODE & VISION BOARD SECTION --- */}
        <DressCodeSection />

        {/* --- ADULTS-ONLY CELEBRATION NOTICE --- */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-3xl mx-auto mb-28 relative z-10"
        >
          <div className="bg-ink/60 backdrop-blur-md border border-[#E8D3B9]/25 rounded-3xl p-8 sm:p-10 md:p-14 text-center shadow-2xl relative overflow-hidden">
            {/* Delicate inner gold border */}
            <div className="absolute inset-2.5 border border-[#E8D3B9]/15 rounded-2xl pointer-events-none" />

            {/* Top-Left Bespoke Engraved SVG Emblem: Fine-line baby carriage with diagonal prohibition slash */}
            <div
              className="absolute top-5 left-5 sm:top-7 sm:left-7 w-12 h-12 sm:w-16 sm:h-16 pointer-events-none select-none flex items-center justify-center opacity-85"
              aria-hidden="true"
            >
              {/* Soft ambient gold halo */}
              <div className="absolute inset-0 rounded-full bg-[#E8D3B9]/10 blur-md" />
              <svg
                viewBox="0 0 64 64"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full"
              >
                {/* Outer & inner architectural rings */}
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="#E8D3B9"
                  strokeWidth="1.2"
                  strokeOpacity="0.65"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="24.5"
                  stroke="#E8D3B9"
                  strokeWidth="0.6"
                  strokeDasharray="2 2"
                  strokeOpacity="0.4"
                />
                {/* Fine-line vintage baby carriage / pram silhouette */}
                <path
                  d="M21 31H42L39.5 40.5C39 42.2 37.5 43.5 35.7 43.5H26.8C25 43.5 23.5 42.2 23 40.5L21 31Z"
                  stroke="#FAF8F5"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeOpacity="0.75"
                />
                {/* Pram canopy hood */}
                <path
                  d="M42 31C42 23.8 36.8 19 30.5 19V31"
                  stroke="#FAF8F5"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeOpacity="0.75"
                />
                {/* Pram push handle */}
                <path
                  d="M21 31L17.5 25H14.5"
                  stroke="#FAF8F5"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeOpacity="0.75"
                />
                {/* Pram wheels */}
                <circle
                  cx="26"
                  cy="47.5"
                  r="2.8"
                  stroke="#FAF8F5"
                  strokeWidth="1.3"
                  strokeOpacity="0.75"
                />
                <circle
                  cx="37"
                  cy="47.5"
                  r="2.8"
                  stroke="#FAF8F5"
                  strokeWidth="1.3"
                  strokeOpacity="0.75"
                />
                {/* Crisp diagonal prohibition slash */}
                <line
                  x1="12.5"
                  y1="51.5"
                  x2="51.5"
                  y2="12.5"
                  stroke="#E8D3B9"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            {/* Top-Right Bespoke 18+ Evening Crest for symmetrical visual balance */}
            <div
              className="absolute top-5 right-5 sm:top-7 sm:right-7 w-12 h-12 sm:w-16 sm:h-16 pointer-events-none select-none flex flex-col items-center justify-center rounded-full border border-[#E8D3B9]/45 bg-ink/40 opacity-85"
              aria-hidden="true"
            >
              <span className="font-serif text-sm sm:text-lg italic text-[#E8D3B9] leading-none">
                18+
              </span>
              <span className="font-sans text-[6.5px] sm:text-[7.5px] uppercase tracking-[0.22em] text-paper/70 mt-0.5">
                Only
              </span>
            </div>

            <div className="flex flex-col items-center gap-3 mb-6 pt-6 sm:pt-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#E8D3B9] shadow-[0_0_12px_#E8D3B9]" />
              <span className="font-sans text-[10.5px] tracking-[0.45em] uppercase font-bold text-[#E8D3B9]">
                An Adult-Only Celebration
              </span>
            </div>

            <h3 className="font-serif text-3xl sm:text-4xl md:text-5xl italic font-light text-paper mb-6">
              Kindly Note
            </h3>

            <div className="w-16 h-px bg-[#E8D3B9]/40 mx-auto mb-6" />

            <p className="font-serif text-lg sm:text-xl md:text-2xl italic text-[#F3E5D8]/95 font-light leading-relaxed max-w-xl mx-auto mb-6">
              &ldquo;While we adore and cherish your little ones, our wedding
              ceremony and reception are strictly adult-only affairs.&rdquo;
            </p>

            <p className="font-sans text-[11px] md:text-xs text-[#F5EDE4]/80 leading-loose tracking-[0.18em] max-w-lg mx-auto">
              We hope this advance notice allows parents to take the night off,
              relax, and fully immerse in an unforgettable evening of black-tie
              celebration with us.
            </p>
          </div>
        </motion.div>

        {/* Bottom RSVP Section - Anchors gracefully at the bottom with ~2cm margin */}
        <div id="rsvp" className="min-h-[75vh] md:min-h-[85vh] flex flex-col justify-end items-center w-full pt-16 md:pt-24">
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-3xl bg-ink/40 backdrop-blur-md border border-[#E8D3B9]/25 rounded-3xl p-8 sm:p-10 md:p-14 relative overflow-hidden flex flex-col items-center text-center shadow-2xl"
          >
            {/* Elegant double inner border */}
            <div className="absolute inset-3 border border-[#E8D3B9]/15 rounded-2xl pointer-events-none" />

            <h2 className="font-sans text-[11px] tracking-[0.6em] uppercase text-[#E8D3B9] mb-5 relative z-10 font-bold">
              Respond
            </h2>
            <h3 className="font-serif text-5xl md:text-7xl mb-4 italic font-light relative z-10 text-paper">
              Kindly Reply
            </h3>
            <p className="font-sans text-[11px] md:text-xs text-[#F5EDE4]/80 mb-10 max-w-sm leading-loose tracking-[0.25em] relative z-10">
              Please honor us with your response by{' '}
              {weddingEventConfig.rsvpDeadline}.
            </p>

            {/* Re-imagined Bespoke RSVP Button */}
            <MagneticWrapper>
              <button
                type="button"
                onClick={() => setIsRsvpModalOpen(true)}
                className="group relative overflow-hidden flex items-center gap-6 px-10 md:px-12 py-4 md:py-5 rounded-full border border-[#E8D3B9] bg-[#E8D3B9] text-ink font-sans text-[11px] tracking-[0.45em] uppercase font-bold transition-all duration-500 shadow-[0_10px_35px_rgba(232,211,185,0.3)] hover:shadow-[0_15px_50px_rgba(232,211,185,0.5)] hover:bg-[#FAF8F5] hover:scale-[1.02] cursor-pointer"
              >
                <span className="relative z-10 font-bold">
                  Reserve Your Seat
                </span>
                <div className="w-8 h-8 rounded-full bg-ink text-paper flex items-center justify-center relative z-10 transition-transform duration-500 group-hover:translate-x-1">
                  <ArrowRight className="w-4 h-4 text-[#E8D3B9]" />
                </div>
              </button>
            </MagneticWrapper>
          </motion.div>

          {/* Slim transparent credit line (no duplicate RSVP, scaled down on mobile) */}
          <div
            className="relative z-10 w-full mt-6 md:mt-8 mb-2 flex flex-col md:flex-row items-center justify-between gap-3 text-paper/85 font-sans text-[8.5px] sm:text-[9.5px] md:text-[11px] tracking-[0.3em] md:tracking-[0.35em] uppercase"
            style={{ textShadow: '0 2px 10px rgba(0,0,0,0.95)' }}
          >
            <div className="flex items-center gap-4">
              <span>&copy; 2026 Ndumiso &amp; Sithandiwe</span>
              <Link
                to="/admin"
                className="text-paper/35 hover:text-[#E8D3B9] transition-colors"
              >
                Host Portal
              </Link>
            </div>
            <a
              href="https://arsonPixelz.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-paper transition-colors"
            >
              <span className="font-light">Engineered by </span>
              <span className="font-bold tracking-[0.32em] md:tracking-[0.4em]">
                arsonPixelz
              </span>
            </a>
          </div>
        </div>
      </div>

      {/* Portal-rendered RSVP Modal Dialog at document.body with Universal High z-index (z-[999]) & Locked Background Scroll */}
      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {isRsvpModalOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsRsvpModalOpen(false)}
                className="fixed inset-0 z-[999] flex items-center justify-center p-4 md:p-6 bg-ink/35 backdrop-blur-[2px]"
              >
                <motion.div
                  initial={{ scale: 0.95, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.95, opacity: 0, y: 20 }}
                  transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
                  onClick={(e) => e.stopPropagation()}
                  className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-[#0E0E0E]/90 backdrop-blur-xl border border-[#E8D3B9]/35 rounded-3xl p-6 sm:p-8 md:p-12 shadow-[0_25px_80px_rgba(0,0,0,0.95)] text-paper"
                >
                  <button
                    type="button"
                    onClick={() => setIsRsvpModalOpen(false)}
                    className="absolute top-5 right-5 z-20 w-9 h-9 rounded-full bg-ink/80 border border-paper/15 flex items-center justify-center text-paper/70 hover:text-paper hover:border-[#E8D3B9] transition-colors cursor-pointer"
                    aria-label="Close RSVP Modal"
                  >
                    <X className="w-4 h-4" />
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
                      <h4 className="font-serif text-2xl text-paper mb-3 italic">
                        Response Recorded
                      </h4>
                      <p className="font-sans text-xs tracking-wider text-paper/70 leading-relaxed max-w-xs mx-auto mb-8">
                        Thank you for sharing in our joy. We cannot wait to
                        celebrate with you at Lakeside Events in Bulawayo!
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setRsvpSubmitted(false);
                          setIsRsvpModalOpen(false);
                        }}
                        className="font-sans text-[11px] tracking-[0.3em] uppercase px-8 py-3 rounded-full border border-paper/30 text-paper hover:bg-paper hover:text-ink transition-colors cursor-pointer"
                      >
                        Done
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="flex flex-col gap-5 text-left">
                      {/* Name input with intelligent search */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="font-sans text-[10px] tracking-[0.3em] uppercase text-paper/70 font-medium">
                            Your Full Name *
                          </label>
                          {verification.isVerified && (
                            <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-[#E8D3B9] font-medium">
                              <UserCheck className="w-3 h-3 text-[#E8D3B9]" />
                              <span>Verified Guest</span>
                            </span>
                          )}
                        </div>
                        <input
                          required
                          type="text"
                          autoComplete="off"
                          placeholder="e.g. Peter Mpofu or Sithandiwe"
                          value={rsvpData.name}
                          onChange={(e) => handleNameChange(e.target.value)}
                          className={`w-full bg-paper/5 border rounded-xl px-4 py-3 text-sm text-paper placeholder:text-paper/25 focus:outline-none transition-colors ${
                            refusalError
                              ? 'border-rose-500/80 bg-rose-950/20 focus:border-rose-500'
                              : verification.isVerified
                              ? 'border-[#E8D3B9]/80 focus:border-[#E8D3B9]'
                              : 'border-paper/15 focus:border-[#E8D3B9]'
                          }`}
                        />

                        {/* Intelligent Suggestion Pills */}
                        {!verification.isVerified && smartSuggestions.length > 0 && (
                          <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
                            <span className="text-[10px] uppercase tracking-widest text-[#E8D3B9]/60 font-medium">
                              Select name:
                            </span>
                            {smartSuggestions.map((g) => (
                              <button
                                key={g.id}
                                type="button"
                                onClick={() => handleSelectGuest(g)}
                                className="px-2.5 py-1 rounded-full bg-[#E8D3B9]/15 border border-[#E8D3B9]/35 text-[#E8D3B9] text-xs hover:bg-[#E8D3B9]/25 hover:border-[#E8D3B9] transition-all cursor-pointer font-serif italic"
                              >
                                {g.name}
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Verified Confirmation */}
                        {verification.isVerified && (
                          <p className="text-[11px] text-[#E8D3B9]/90 mt-2 flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#E8D3B9] shrink-0" />
                            <span>Invitation confirmed for <strong>{verification.matchedGuest?.name}</strong></span>
                          </p>
                        )}

                        {/* Already RSVPed Notice to prevent duplicate submissions */}
                        {alreadyRsvpedGuest && (
                          <div className="mt-2.5 p-3 rounded-xl bg-[#E8D3B9]/10 border border-[#E8D3B9]/35 text-[#E8D3B9] text-[11px] flex items-start gap-2.5 leading-relaxed">
                            <Sparkles className="w-4 h-4 shrink-0 mt-0.5 text-[#E8D3B9]" />
                            <div>
                              <strong>Your RSVP is already recorded</strong> (
                              {alreadyRsvpedGuest.rsvpStatus === 'declining'
                                ? 'Declined'
                                : 'Attending'}{' '}
                              &bull; {alreadyRsvpedGuest.rsvpGuests || 1}{' '}
                              {(alreadyRsvpedGuest.rsvpGuests || 1) > 1
                                ? 'Guests'
                                : 'Guest'}
                              ). You only need to submit again if you want to
                              update your response.
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Phone / WhatsApp Field */}
                      <div>
                        <label className="font-sans text-[10px] tracking-[0.3em] uppercase text-paper/70 block mb-2 font-medium">
                          Phone / WhatsApp Number *
                        </label>
                        <input
                          required
                          type="tel"
                          placeholder="e.g. 077 123 4567 or +263 77 123 4567"
                          value={rsvpData.phone}
                          onChange={(e) => {
                            setRefusalError(null);
                            setRsvpData({ ...rsvpData, phone: e.target.value });
                          }}
                          className="w-full bg-paper/5 border border-paper/15 rounded-xl px-4 py-3 text-sm text-paper placeholder:text-paper/25 focus:outline-none focus:border-[#E8D3B9] transition-colors"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="font-sans text-[10px] tracking-[0.3em] uppercase text-paper/70 block mb-2 font-medium">
                            Attendance
                          </label>
                          <select
                            value={rsvpData.attendance}
                            onChange={(e) =>
                              setRsvpData({
                                ...rsvpData,
                                attendance: e.target.value,
                              })
                            }
                            className="w-full bg-[#181818] border border-paper/15 rounded-xl px-4 py-3 text-sm text-paper focus:outline-none focus:border-[#E8D3B9] transition-colors"
                          >
                            <option value="attending">Joyfully Accept</option>
                            <option value="declining">
                              Regretfully Decline
                            </option>
                          </select>
                        </div>

                        <div>
                          <label className="font-sans text-[10px] tracking-[0.3em] uppercase text-paper/70 block mb-2 font-medium">
                            Guests
                          </label>
                          <select
                            value={rsvpData.guests}
                            onChange={(e) =>
                              setRsvpData({
                                ...rsvpData,
                                guests: e.target.value,
                              })
                            }
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
                          onChange={(e) =>
                            setRsvpData({ ...rsvpData, notes: e.target.value })
                          }
                          className="w-full bg-paper/5 border border-paper/15 rounded-xl px-4 py-2.5 text-sm text-paper placeholder:text-paper/25 focus:outline-none focus:border-[#E8D3B9] transition-colors resize-none"
                        />
                      </div>

                      {/* Strict Client-side Refusal Banner */}
                      {refusalError && (
                        <div className="p-4 rounded-2xl bg-rose-950/60 border border-rose-500/60 text-rose-200 text-xs flex items-start gap-3 leading-relaxed shadow-xl">
                          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                          <div>
                            <p className="font-semibold text-rose-100 mb-0.5">RSVP Not Permitted</p>
                            <p className="text-rose-200/90">{refusalError}</p>
                          </div>
                        </div>
                      )}

                      <p className="font-sans text-[9.5px] uppercase tracking-[0.25em] text-[#E8D3B9]/80 text-center font-medium my-1">
                        * Kindly note: This is an adults-only celebration (18+).
                      </p>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full mt-2 py-4 rounded-xl bg-[#E8D3B9] text-ink font-sans text-[11px] tracking-[0.4em] uppercase font-bold hover:bg-[#FAF8F5] transition-all shadow-[0_10px_30px_rgba(232,211,185,0.25)] disabled:opacity-60 cursor-pointer"
                      >
                        {isSubmitting
                          ? 'Checking Guest List...'
                          : 'Send RSVP Response'}
                      </button>
                    </form>
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </motion.div>
  );
};
