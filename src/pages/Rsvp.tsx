import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import { MagneticWrapper } from '../components/MagneticWrapper';
import { weddingEventConfig } from '../data/weddingData';

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
  const [rsvpData, setRsvpData] = useState({
    name: '',
    email: '',
    attendance: 'attending',
    guests: '1',
    notes: '',
  });
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [redirectCountdown, setRedirectCountdown] = useState(4);

  // When form is submitted via this custom route, automatically route to the Home page
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const endpoint =
      (import.meta as any).env?.VITE_RSVP_ENDPOINT ||
      'https://script.google.com/macros/s/AKfycbyTGxdmSFL2N5hEisMyTjgGQ_aOcr06TKavP-PwevV8zwnHN6A-j8nVyk-3Vn3_rugSSA/exec';

    if (endpoint) {
      try {
        await fetch(endpoint, {
          method: 'POST',
          mode: 'no-cors',
          body: new URLSearchParams({
            ...rsvpData,
            submittedAt: new Date().toISOString(),
          }),
        });
      } catch (err) {
        console.error('RSVP submission error:', err);
      }
    }
    setIsSubmitting(false);
    setRsvpSubmitted(true);
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={tSettings}
      className="min-h-screen bg-ink text-paper relative flex flex-col justify-center items-center py-20 px-4 sm:px-6"
    >
      {/* Fixed Luxury Background Image - Highly Visible & Vibrant */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-ink overflow-hidden">
        <img
          src="/photos/couple-embrace-direct.jpg"
          alt="Ndumiso & Sithandiwe"
          className="w-full h-full object-cover object-[center_12%] opacity-85 brightness-95 scale-100 will-change-transform"
        />
        {/* Soft, delicate vignette allowing the couple's portrait to shine through */}
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
              {weddingEventConfig.dateDisplay} &bull; {weddingEventConfig.venueCity}
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
                Thank you for your response! Your RSVP has been saved directly to our guest list. We look forward to celebrating with you at Lakeside Events in Bulawayo!
              </p>
              
              {/* Auto-redirect notification pill */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-paper/5 border border-[#E8D3B9]/30 text-[#E8D3B9] text-[10.5px] font-sans tracking-widest uppercase mb-8">
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
                <span>Redirecting to celebration in {redirectCountdown}s...</span>
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
            <form onSubmit={handleSubmit} className="flex flex-col gap-5 text-left">
              <div>
                <label className="font-sans text-[10px] tracking-[0.3em] uppercase text-paper/70 block mb-2 font-medium">
                  Your Full Name *
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Sipho & Guest"
                  value={rsvpData.name}
                  onChange={(e) =>
                    setRsvpData({ ...rsvpData, name: e.target.value })
                  }
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
                  onChange={(e) =>
                    setRsvpData({ ...rsvpData, email: e.target.value })
                  }
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

              <p className="font-sans text-[9.5px] uppercase tracking-[0.22em] text-[#E8D3B9]/80 text-center font-medium my-1">
                * Kindly note: This is an adults-only celebration (18+).
              </p>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 py-4 rounded-xl bg-[#E8D3B9] text-ink font-sans text-[11px] tracking-[0.4em] uppercase font-bold hover:bg-[#FAF8F5] transition-all shadow-[0_10px_30px_rgba(232,211,185,0.25)] disabled:opacity-60 cursor-pointer"
              >
                {isSubmitting ? 'Recording to Guest List...' : 'Send RSVP Response'}
              </button>
            </form>
          )}

          {/* Direct link to browse the full experience */}
          <div className="mt-8 pt-6 border-t border-paper/10 text-center">
            <Link
              to="/details"
              className="inline-flex items-center gap-2 font-sans text-[10px] uppercase tracking-[0.25em] text-[#E8D3B9]/80 hover:text-[#E8D3B9] transition-colors"
            >
              <span>Explore Wedding Details &amp; Dress Code</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};
