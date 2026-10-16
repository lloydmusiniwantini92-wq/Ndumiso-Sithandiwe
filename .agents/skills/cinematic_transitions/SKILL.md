---
name: Cinematic Transitions
description: A luxury, high-end animation library using Framer Motion and React for creating museum-quality layouts with fluid transitions, magnetic hover states, preloading sequences, and synchronised audio drops.
---

# Cinematic Transitions

When the user requests "Cinematic Transitions", "Museum-Quality Animation", or specifically references this skill, you MUST deploy the following 5 golden transitions/mechanisms exactly as documented below. They are designed to transform a standard React/Next.js layout into a phenomenal, tactile interactive experience.

All transitions rely on `motion/react` (Framer Motion) and standard React hooks (`useRef`, `useState`, `useEffect`).

## 1. The Cinematic Page Wipe
Replace standard route crossfades (opacity fades) with a dramatic blur, wipe, and scale.

**Implementation Rules:**
- Apply this directly to the page wrapper (e.g., `<motion.div>`) around the page content inside an `<AnimatePresence mode="wait">` block.
- Use a precise cubic-bezier easing curve `[0.76, 0, 0.24, 1]` for incredibly expensive-feeling motion.

```tsx
const tSettings = { duration: 1.4, ease: [0.76, 0, 0.24, 1] };
const pageVariants = {
  initial: { opacity: 0, filter: 'blur(10px)', scale: 1.05 },
  animate: { opacity: 1, filter: 'blur(0px)', scale: 1 },
  exit: { opacity: 0, filter: 'blur(10px)', scale: 0.95 },
};

// Usage pattern for page wrapper:
<motion.div
  variants={pageVariants}
  initial="initial"
  animate="animate"
  exit="exit"
  transition={tSettings}
>
  {/* Page Content */}
</motion.div>
```

## 2. The Magnetic Micro-Interaction Engine
Creates a tactile physics effect, physically pulling buttons or links slightly toward the user's cursor when hovered.

**Implementation Rules:**
- Wrap buttons, menu icons, and navigation text links inside a `<MagneticWrapper>`.
- The `inline-flex` class ensures the layout does not break when wrapping inline UI elements.
- The physics engine maps `getBoundingClientRect()` accurately.

```tsx
function MagneticWrapper({ children, className = "" }: any) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current!.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    
    // 0.25 dictates the magnetic pull strength
    setPosition({ x: middleX * 0.25, y: middleY * 0.25 });
  };

  const reset = () => setPosition({ x: 0, y: 0 });

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className={`relative inline-flex z-10 ${className}`}
    >
      {children}
    </motion.div>
  );
}
```

## 3. The Parallax Scroll Architect
Generates massive depth between images and text as the user scrolls, moving the planes across the Y-axis at different rates.

**Implementation Rules:**
- Always map `scrollYProgress` using `useTransform`.
- Shift the image rapidly down while ensuring it scales slightly up on initial hover, and shift floating text-blocks upward against the scroll current.

```tsx
function ParallaxCard({ item, index }: { item: any, index: number }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const containerY = useTransform(scrollYProgress, [0, 0.3], [150, 0]);
  const imageY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["20%", "-20%"]);

  return (
    <div ref={ref}>
      <motion.div style={{ opacity, y: containerY }}>
        {/* Render tall image setting scale to 1.15 */}
        <motion.img style={{ y: imageY, scale: 1.15 }} src={item.image} />
      </motion.div>
      <motion.div style={{ opacity, y: textY }}>
        {/* Render overlapping frosted glass text card here */}
      </motion.div>
    </div>
  );
}
```

## 4. The Luxury Preloader Curtain
A gorgeous initial load sequence that displays a massive 0-100% minimalist ticker before unveiling the main site via an aggressive upward `blur` exit.

**Implementation Rules:**
- Map a robust `setInterval` ticker to mock progress logic accurately simulating file hydration.
- Wait `600ms` precisely upon hitting 100% before firing the `onComplete` callback.
- Set the Z-index massively high (`z-[100]`).

```tsx
function Preloader({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = 2000; 
    const interval = 20; 
    let current = 0;
    
    const timer = setInterval(() => {
      current += (100 / (duration / interval));
      if (current >= 100) {
        setProgress(100);
        clearInterval(timer);
        setTimeout(onComplete, 600); 
      } else {
        setProgress(Math.floor(current));
      }
    }, interval);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <motion.div 
      className="fixed inset-0 z-[100] bg-ink text-paper flex flex-col items-center justify-center pointer-events-none"
      initial={{ y: 0 }}
      exit={{ y: "-100%", filter: "blur(20px)" }}
      transition={{ duration: 1.4, ease: [0.76, 0, 0.24, 1] }}
    >
      <div className="font-serif text-[8rem] md:text-[14rem] leading-none tracking-tighter tabular-nums font-light">
        {progress}
        <span className="text-4xl text-paper/30 ml-2">%</span>
      </div>
      <div className="absolute bottom-16 md:bottom-24 w-64 h-[1px] bg-paper/10 overflow-hidden">
        <motion.div 
          className="h-full bg-paper"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>
    </motion.div>
  );
}
```

## 5. The Dynamic Audio Crescendo Engine
A Web Audio implementation mapping a custom `requestAnimationFrame` volume fader for smooth, cinematic swells to create emotional impact during massive visual transitions.

**Implementation Rules:**
- Browsers require user interaction before autoplaying audio. Tie initialization to a global `click` listener on mount with `once: true`.
- Implement `fadeVolume()` to smoothly interpolate volume rather than assigning values strictly, to prevent audio clipping.
- The crescendo triggers an 80% volume swell immediately, holds it during an intensive animation phase, and settles automatically to a muted 35% ambient level safely.

```tsx
function fadeVolume(audio: HTMLAudioElement, targetVolume: number, duration: number, onComplete?: () => void) {
  const startVolume = audio.volume;
  const change = targetVolume - startVolume;
  const startTime = performance.now();

  function step(currentTime: number) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easeProgress = progress * (2 - progress); // Ease out quad
    
    audio.volume = Math.max(0, Math.min(1, startVolume + change * easeProgress));

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      if (onComplete) onComplete();
    }
  }
  requestAnimationFrame(step);
}

// Inside Audio Context block
const triggerCrescendo = () => {
    if (!audioRef.current) return;
    
    // Rapid intense blast (e.g. hitting Enter Story)
    fadeVolume(audioRef.current, 0.8, 1500);

    // Fade volume slowly to resting cinematic plateau after climax
    setTimeout(() => {
        fadeVolume(audioRef.current, 0.35, 4000);
    }, 8000);
};
```
