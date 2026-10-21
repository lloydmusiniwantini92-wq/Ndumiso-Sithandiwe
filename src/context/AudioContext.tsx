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

    // Attempt automatic playback on load
    const startAudio = () => {
      audio
        .play()
        .then(() => {
          setIsMuted(false);
          setHasInteracted(true);
        })
        .catch(() => {
          // If modern browser autoplay policy halts un-gestured audio,
          // unlock immediately on the very first touch/scroll/click/key
          const unlock = (e: Event) => {
            const target = e.target as HTMLElement | null;
            if (target?.closest('button[data-audio-btn]')) return;

            if (audioRef.current && audioRef.current.paused) {
              audioRef.current.volume = 0.35;
              audioRef.current
                .play()
                .then(() => {
                  setIsMuted(false);
                  setHasInteracted(true);
                })
                .catch(console.error);
            }
            window.removeEventListener('pointerdown', unlock);
            window.removeEventListener('click', unlock);
            window.removeEventListener('touchstart', unlock);
            window.removeEventListener('scroll', unlock);
            window.removeEventListener('keydown', unlock);
          };

          window.addEventListener('pointerdown', unlock, { once: true });
          window.addEventListener('click', unlock, { once: true });
          window.addEventListener('touchstart', unlock, { once: true });
          window.addEventListener('scroll', unlock, { once: true });
          window.addEventListener('keydown', unlock, { once: true });
        });
    };

    startAudio();

    return () => {
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
