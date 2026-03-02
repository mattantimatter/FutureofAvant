/**
 * Antimatter AI Brand Theme
 * Single source of truth for design tokens.
 * Use Tailwind classes (bg-accent, text-foreground, etc.) in components;
 * use these constants for inline styles or JS logic.
 */
export const theme = {
  colors: {
    background: '#020202',
    foreground: '#f6f6fd',
    accent: '#696aac',
    primary: '#3e3f7e',
    secondary: '#a2a3e9',
    tertiary: '#c7c8f2',
    lightaccent: '#e3e3f8',
    // Functional
    cardBg: 'rgba(246,246,253,0.03)',
    cardBgHover: 'rgba(246,246,253,0.05)',
    cardBorder: 'rgba(246,246,253,0.10)',
    cardBorderHover: 'rgba(246,246,253,0.20)',
    muted: 'rgba(246,246,253,0.50)',
    mutedStrong: 'rgba(246,246,253,0.65)',
    divider: 'rgba(246,246,253,0.10)',
    // Status
    success: '#4ade80',   // green-400
    warning: '#facc15',  // yellow-400
    error: '#f87171',    // red-400
    // Accent opacity variants
    accentSubtle: 'rgba(105,106,172,0.15)',
    accentDim: 'rgba(105,106,172,0.30)',
    accentGlow: 'rgba(105,106,172,0.20)',
  },
  gradients: {
    // Signature Antimatter button gradient
    button: 'linear-gradient(93.92deg, #8587e3 -13.51%, #4c4dac 40.91%, #696aac 113.69%)',
    hero: 'linear-gradient(180deg, #020202 0%, rgba(62,63,126,0.08) 50%, #020202 100%)',
    card: 'linear-gradient(135deg, rgba(246,246,253,0.05) 0%, rgba(246,246,253,0.02) 100%)',
    purpleBloom: 'radial-gradient(ellipse at 50% 0%, rgba(105,106,172,0.20) 0%, transparent 65%)',
    subtleAccent: 'radial-gradient(ellipse at 50% 50%, rgba(62,63,126,0.12) 0%, transparent 70%)',
  },
  shadows: {
    accentGlow: '0px 0px 10px #696aac, inset 0px 0px 2px rgba(255,255,255,0.61)',
    accentGlowHover: '0px 0px 25px #696aac, inset 0px 0px 6.69843px rgba(255,255,255,0.9)',
    accentSoft: '0 0 40px rgba(105,106,172,0.20)',
    accentSmall: '0 0 16px rgba(105,106,172,0.15)',
    card: '0 4px 24px rgba(0,0,0,0.5)',
    modal: '0 25px 80px rgba(0,0,0,0.7)',
  },
  radius: {
    pill: '40px',
    card: '1rem',
    lg: '1.25rem',
    xl: '1.5rem',
  },
  typography: {
    fontSans: "'Plus Jakarta Sans', Arial, Helvetica, sans-serif",
    fontSignature: "'Dancing Script', 'Brush Script MT', cursive",
    fontMono: "'JetBrains Mono', 'Fira Code', monospace",
  },
  motion: {
    easeOut: [0.16, 1, 0.3, 1] as const,
    spring: { type: 'spring', stiffness: 300, damping: 30 },
    fast: { duration: 0.15 },
    normal: { duration: 0.3 },
    slow: { duration: 0.6 },
  },
} as const

export type ThemeColors = typeof theme.colors
