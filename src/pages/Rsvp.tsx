import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  CheckCircle2,
  Loader2,
  UserCheck,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { weddingEventConfig } from '../data/weddingData';
import {
  verifyGuestName,
  smartMatchGuests,
  getActiveGuestList,
  syncWithGoogleSheets,
  submitGuestRsvp,
  GuestEntry,
} from '../data/guestListData';

const tSettings = { duration: 1.2, ease: [0.76, 0, 0.24, 1] as const };
const pageVariants = {
  initial: { opacity: 0, filter: 'blur(10px)' },
  animate: {
    opacity: 1,
    filter: 'blur(0px)',
    transitionEnd: { filter: 'none' },
  },
  exit: { opacity: 0, filter: 'blur(10px)' },
};

export const Rsvp: React.FC = () => {
  const navigate = useNavigate();
  const [guestList, setGuestList] = useState<GuestEntry[]>(() =>
    getActiveGuestList()
  );
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
  const [redirectCountdown, setRedirectCountdown] = useState(4);
  const submittingLockRef = useRef(false);

  // Sync live guest list and RSVP statuses on mount and when Admin updates occur
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

  // Auto-redirect after submission
  useEffect(() => {
    if (!rsvpSubmitted) return;

    const interval = setInterval(() => {
      setRedirectCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          navigate('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [rsvpSubmitted, navigate]);

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
      return;
    }

    // 2. Strict Phone Validation (reject letters or garbage strings):
    const cleanPhone = rsvpData.phone.replace(/[\s\-\+\(\)]/g, '');
    if (!/^\d{7,15}$/.test(cleanPhone)) {
      setRefusalError(
        'Please enter a valid phone or WhatsApp number (digits only, at least 7 digits).'
      );
      return;
    }

    // 3. Authorized, deduplicated submission:
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
      className="min-h-screen bg-ink text-paper relative flex flex-col justify-center items-center py-20 px-4 sm:px-6"
    >
      {/* Fixed Luxury Background Image */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-ink overflow-hidden">
        <img
          src="/photos/couple-embrace-direct.jpg"
          alt="Ndumiso & Sithandiwe"
          className="w-full h-full object-cover object-[center_12%] opacity-85 brightness-95 scale-100 will-change-transform"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/35 via-transparent to-ink/75" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(5,5,5,0.65)_100%)]" />
      </div>

      {/* Main Centered RSVP Form Card */}
      <div className="relative z-10 w-full max-w-xl my-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-[#0E0E0E]/85 backdrop-blur-xl border border-[#E8D3B9]/35 rounded-3xl p-6 sm:p-10 md:p-12 shadow-[0_25px_80px_rgba(0,0,0,0.95)]"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-[#E8D3B9] shadow-[0_0_10px_#E8D3B9]" />
              <span className="font-sans text-[10px] tracking-[0.45em] uppercase text-[#E8D3B9] font-bold">
                Wedding Celebration &bull; RSVP
              </span>
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl italic font-light text-paper mb-3">
              Kindly Respond
            </h1>
            <p className="font-serif italic text-sm sm:text-base text-[#E8D3B9]/90 font-light mb-1">
              Ndumiso Masuku &amp; Sithandiwe Sibanda
            </p>
            <p className="font-sans text-[10px] tracking-[0.25em] uppercase text-paper/60">
              {weddingEventConfig.dateDisplay} &bull;{' '}
              {weddingEventConfig.venueCity}
            </p>
            <div className="w-16 h-px bg-[#E8D3B9]/40 mx-auto mt-4" />
          </div>

          {rsvpSubmitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-6"
            >
              <div className="w-16 h-16 rounded-full bg-[#E8D3B9]/15 border border-[#E8D3B9]/40 flex items-center justify-center mx-auto mb-6 text-[#E8D3B9]">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="font-serif text-3xl text-paper mb-3 italic">
                Response Recorded
              </h2>
              <p className="font-sans text-xs tracking-wider text-paper/85 leading-relaxed max-w-sm mx-auto mb-4">
                Thank you! Your RSVP is confirmed on our guest list (no need to
                submit again). We look forward to celebrating with you at
                Lakeside Events in Bulawayo!
              </p>

              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-paper/5 border border-[#E8D3B9]/30 text-[#E8D3B9] text-[10.5px] font-sans tracking-widest uppercase mb-8">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#E8D3B9]" />
                <span>
                  Redirecting to celebration in {redirectCountdown}s...
                </span>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="w-full sm:w-auto font-sans text-[11px] tracking-[0.3em] uppercase px-8 py-3.5 rounded-full bg-[#E8D3B9] text-ink font-bold hover:bg-[#FAF8F5] transition-all cursor-pointer shadow-[0_5px_20px_rgba(232,211,185,0.3)]"
                >
                  Enter Celebration Now &rarr;
                </button>
              </div>
            </motion.div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-5 text-left"
            >
              {/* Full Name Field with Intelligent Matching */}
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
                    <span>
                      Invitation confirmed for{' '}
                      <strong>{verification.matchedGuest?.name}</strong>
                    </span>
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
                      ). You only need to submit again if you want to update
                      your response.
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

              {/* Attendance & Number of Guests */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-sans text-[10px] tracking-[0.3em] uppercase text-paper/70 block mb-2 font-medium">
                    Attendance
                  </label>
                  <select
                    value={rsvpData.attendance}
                    onChange={(e) =>
                      setRsvpData({ ...rsvpData, attendance: e.target.value })
                    }
                    className="w-full bg-[#181818] border border-paper/15 rounded-xl px-4 py-3 text-sm text-paper focus:outline-none focus:border-[#E8D3B9] transition-colors"
                  >
                    <option value="attending">Joyfully Accept</option>
                    <option value="declining">Regretfully Decline</option>
                  </select>
                </div>

                <div>
                  <label className="font-sans text-[10px] tracking-[0.3em] uppercase text-paper/70 block mb-2 font-medium">
                    Number of Guests
                  </label>
                  <select
                    value={rsvpData.guests}
                    onChange={(e) =>
                      setRsvpData({ ...rsvpData, guests: e.target.value })
                    }
                    className="w-full bg-[#181818] border border-paper/15 rounded-xl px-4 py-3 text-sm text-paper focus:outline-none focus:border-[#E8D3B9] transition-colors"
                  >
                    <option value="1">1 Person</option>
                    <option value="2">2 People</option>
                  </select>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="font-sans text-[10px] tracking-[0.3em] uppercase text-paper/70 block mb-2 font-medium">
                  Special Dietary / Heartfelt Wishes
                </label>
                <textarea
                  rows={2}
                  placeholder="Allergies, preferences, or a note for the couple..."
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
                    <p className="font-semibold text-rose-100 mb-0.5">
                      RSVP Not Permitted
                    </p>
                    <p className="text-rose-200/90">{refusalError}</p>
                  </div>
                </div>
              )}

              <p className="font-sans text-[9.5px] uppercase tracking-[0.22em] text-[#E8D3B9]/80 text-center font-medium my-1">
                * Kindly note: This is an adults-only celebration (18+).
              </p>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 py-4 rounded-xl bg-[#E8D3B9] text-ink font-sans text-[11px] tracking-[0.4em] uppercase font-bold hover:bg-[#FAF8F5] transition-all shadow-[0_10px_30px_rgba(232,211,185,0.25)] disabled:opacity-60 cursor-pointer"
              >
                {isSubmitting
                  ? 'Saving Your RSVP...'
                  : alreadyRsvpedGuest
                  ? 'Update Existing RSVP'
                  : 'Send RSVP Response'}
              </button>
            </form>
          )}

          {/* Direct link to browse the full experience */}
          <div className="mt-8 pt-6 border-t border-paper/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-center">
            <Link
              to="/details"
              className="inline-flex items-center gap-2 font-sans text-[10px] uppercase tracking-[0.25em] text-[#E8D3B9]/80 hover:text-[#E8D3B9] transition-colors"
            >
              <span>Explore Wedding Details &amp; Dress Code</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              to="/admin"
              className="font-sans text-[9.5px] uppercase tracking-[0.22em] text-paper/35 hover:text-[#E8D3B9] transition-colors"
            >
              Host Portal
            </Link>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};
