import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { ArrowUp, Sparkles } from "lucide-react";

export const ScrollProgress = () => {
  const { scrollYProgress, scrollY } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  const [showBackToTop, setShowBackToTop] = useState(false);
  const [scrollPercentage, setScrollPercentage] = useState(0);

  useEffect(() => {
    return scrollY.on("change", (latest) => {
      setShowBackToTop(latest > 320);
      const totalDocHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalDocHeight > 0) {
        const percent = Math.min(100, Math.max(0, Math.round((latest / totalDocHeight) * 100)));
        setScrollPercentage(percent);
      }
    });
  }, [scrollY]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      {/* Ultra-smooth top progress indicator bar */}
      <motion.div
        id="scroll-progress-bar"
        className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-rose-500 via-primary to-amber-400 origin-left z-50 pointer-events-none shadow-[0_0_12px_rgba(230,40,80,0.7)]"
        style={{ scaleX }}
      />

      {/* Floating interactive Back to Top button with circular progress meter */}
      <motion.div
        id="back-to-top-button"
        initial={{ opacity: 0, scale: 0.6, y: 20 }}
        animate={{
          opacity: showBackToTop ? 1 : 0,
          scale: showBackToTop ? 1 : 0.6,
          y: showBackToTop ? 0 : 20,
          pointerEvents: showBackToTop ? "auto" : "none",
        }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="fixed bottom-24 right-6 z-40"
      >
        <button
          onClick={scrollToTop}
          aria-label="Scroll back to top"
          className="relative group flex items-center justify-center w-12 h-12 rounded-full glass-ios text-foreground shadow-2xl hover:border-primary/80 transition-all duration-300 active:scale-95"
        >
          {/* Circular progress SVG ring */}
          <svg className="w-12 h-12 -rotate-90 absolute inset-0 pointer-events-none" viewBox="0 0 48 48">
            <circle
              cx="24"
              cy="24"
              r="20"
              className="text-white/10 stroke-current"
              strokeWidth="2.5"
              fill="transparent"
            />
            <circle
              cx="24"
              cy="24"
              r="20"
              className="text-primary stroke-current transition-all duration-150"
              strokeWidth="2.5"
              strokeDasharray={2 * Math.PI * 20}
              strokeDashoffset={2 * Math.PI * 20 * (1 - scrollPercentage / 100)}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>

          {/* Central arrow icon with hover upward leap */}
          <div className="relative z-10 flex flex-col items-center justify-center">
            <ArrowUp className="w-5 h-5 text-rose-300 group-hover:-translate-y-0.5 group-hover:text-white transition-transform duration-200" />
            <span className="text-[9px] font-bold text-muted-foreground group-hover:text-primary-foreground transition-colors">
              {scrollPercentage}%
            </span>
          </div>

          {/* Subtle hover glow ring */}
          <div className="absolute inset-0 rounded-full bg-primary/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
        </button>
      </motion.div>
    </>
  );
};
