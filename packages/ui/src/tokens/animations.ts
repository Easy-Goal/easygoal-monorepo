export const animations = {
  shimmer: "shimmer 1.5s infinite",
  fadeUp: "fade-up 0.4s ease-out",
  slideUp: "slide-up 0.3s ease-out",
  float: "float 3s ease-in-out infinite",
  pulseRing: "pulse-ring 2s infinite",
} as const;

export const keyframes = {
  shimmer: {
    "0%": { transform: "translateX(-100%)" },
    "100%": { transform: "translateX(100%)" },
  },
  "fade-up": {
    from: { opacity: "0", transform: "translateY(16px)" },
    to: { opacity: "1", transform: "translateY(0)" },
  },
  "slide-up": {
    from: { opacity: "0", transform: "translateY(8px)" },
    to: { opacity: "1", transform: "translateY(0)" },
  },
  float: {
    "0%, 100%": { transform: "translateY(0px)" },
    "50%": { transform: "translateY(-8px)" },
  },
  "pulse-ring": {
    "0%": { boxShadow: "0 0 0 0 hsl(18 100% 62% / 0.4)" },
    "70%": { boxShadow: "0 0 0 10px hsl(18 100% 62% / 0)" },
    "100%": { boxShadow: "0 0 0 0 hsl(18 100% 62% / 0)" },
  },
} as const;
