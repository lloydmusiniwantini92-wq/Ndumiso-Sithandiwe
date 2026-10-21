import React, { useRef, useEffect, useState, createContext, useContext } from 'react';

interface AudioContextType {
  triggerCrescendo: () => void;
  isMuted: boolean;
  toggleMute: () => void;
  hasInteracted: boolean;
}

export const AudioContext = createContext<AudioContextType>({
  triggerCrescendo: () => {},
  isMuted: false,
  toggleMute: () => {},
  hasInteracted: false,
});

export function useAudio() {
  return useContext(AudioContext);
}

export function fadeVolume(
  audio: HTMLAudioElement,
  targetVolume: number,
  duration: number,
  onComplete?: () => void
) {
  const startVolume = audio.volume;
  const change = targetVolume - startVolume;
  const startTime = performance.now();

  function step(currentTime: number) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easeProgress = progress * (2 - progress);

    audio.volume = Math.max(0, Math.min(1, startVolume + change * easeProgress));

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      if (onComplete) onComplete();
    }
  }
  requestAnimationFrame(step);
}

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isMuted, setIsMuted] = useState(false); // Default state: automatic play on load
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isCrescendo, setIsCrescendo] = useState(false);

  useEffect(() => {
    const audio = new Audio('/music/Cinema.mp3');
    audio.loop = true;
    audio.preload = 'auto';
    audio.volume = 0.35;
    audioRef.current = audio;

    const events = ['click', 'pointerdown', 'touchend', 'keydown'];

    const removeListeners = () => {
      events.forEach((evt) => {
        document.removeEventListener(evt, unlockHandler, true);
        window.removeEventListener(evt, unlockHandler, true);
      });
    };

    const unlockHandler = (e: Event) => {
      const target = e.target as HTMLElement | null;
      // If the user explicitly clicked the speaker button, let toggleMute handle it
      if (target?.closest('button[data-audio-btn]')) {
        removeListeners();
        return;
      }

      const currentAudio = audioRef.current;
      if (!currentAudio) return;

      if (!currentAudio.paused) {
        removeListeners();
        return;
      }

      currentAudio.volume = 0.05;
      currentAudio
        .play()
        .then(() => {
          setIsMuted(false);
          setHasInteracted(true);
          fadeVolume(currentAudio, 0.35, 1200);
          removeListeners();
        })
        .catch(() => {
          // Keep listeners active if the browser did not treat this event as a valid activation
        });
    };

    const attachListeners = () => {
      events.forEach((evt) => {
        document.addEventListener(evt, unlockHandler, {
          capture: true,
          passive: true,
        });
        window.addEventListener(evt, unlockHandler, {
          capture: true,
          passive: true,
        });
      });
    };

    // Attempt automatic playback on load
    audio
      .play()
      .then(() => {
        setIsMuted(false);
        setHasInteracted(true);
      })
      .catch(() => {
        // Browser autoplay policy blocked un-gestured audio; unlock on very first tap/click anywhere
        attachListeners();
      });

    return () => {
      removeListeners();
      audio.pause();
      audio.src = '';
    };
  }, []);

  const triggerCrescendo = () => {
    setIsCrescendo(true);
    if (!audioRef.current) return;

    if (audioRef.current.paused) {
      audioRef.current.volume = 0.35;
      audioRef.current
        .play()
        .then(() => {
          setIsMuted(false);
          setHasInteracted(true);
        })
        .catch(console.error);
    }

    fadeVolume(audioRef.current, 0.7, 1500);
    setTimeout(() => {
      if (audioRef.current && !audioRef.current.paused) {
        fadeVolume(audioRef.current, 0.35, 4000);
        setIsCrescendo(false);
      }
    }, 8000);
  };

  const toggleMute = () => {
    if (!audioRef.current) return;

    if (isMuted || audioRef.current.paused) {
      audioRef.current.volume = isCrescendo ? 0.7 : 0.35;
      audioRef.current
        .play()
        .then(() => {
          setIsMuted(false);
          setHasInteracted(true);
        })
        .catch((err) => {
          console.warn('Playback error:', err);
        });
    } else {
      audioRef.current.pause();
      setIsMuted(true);
    }
  };

  return (
    <AudioContext.Provider value={{ triggerCrescendo, isMuted, toggleMute, hasInteracted }}>
      {children}
    </AudioContext.Provider>
  );
}
