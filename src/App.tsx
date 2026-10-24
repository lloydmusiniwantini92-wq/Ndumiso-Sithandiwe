import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { AudioProvider } from './context/AudioContext';
import { CustomCursor } from './components/CustomCursor';
import { Preloader } from './components/Preloader';
import { Navigation } from './components/Navigation';
import { Home } from './pages/Home';
import { Journey } from './pages/Journey';
import { Details } from './pages/Details';
import { Rsvp } from './pages/Rsvp';

const AnimatedRoutes: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <AnimatePresence mode="wait">
      <Routes location={location}>
        <Route path="/" element={<Home />} />
        <Route path="/journey" element={<Journey />} />
        <Route path="/details" element={<Details />} />
        <Route path="/rsvp" element={<Rsvp />} />
      </Routes>
    </AnimatePresence>
  );
};

export default function App() {
  const [loading, setLoading] = useState(true);

  return (
    <AudioProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-paper text-ink selection:bg-ink selection:text-paper relative">
          <CustomCursor />

          <div
            className="fixed inset-0 pointer-events-none z-50 opacity-[0.04] mix-blend-multiply"
            style={{
              backgroundImage:
                'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")',
            }}
          />

          <AnimatePresence mode="wait">
            {loading ? (
              <Preloader key="preloader" onComplete={() => setLoading(false)} />
            ) : (
              <motion.div
                key="app-content"
                className="contents"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.5 }}
              >
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
