import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        accent: 'var(--accent)',
        primary: 'var(--primary)',
        secondary: 'var(--secondary)',
        tertiary: 'var(--tertiary)',
        lightaccent: 'var(--lightaccent)',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Arial', 'Helvetica', 'sans-serif'],
        signature: ['Dancing Script', 'Brush Script MT', 'cursive'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      screens: {
        xs: '350px',
        mobile: '512px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
        wide: '2060px',
      },
      maxWidth: {
        main: 'var(--w-main)',
      },
      backgroundImage: {
        'gradient-accent': 'linear-gradient(93.92deg, #8587e3 -13.51%, #4c4dac 40.91%, #696aac 113.69%)',
        'gradient-hero': 'linear-gradient(180deg, #020202 0%, #050510 50%, #020202 100%)',
        'gradient-card': 'linear-gradient(135deg, rgba(246,246,253,0.05) 0%, rgba(246,246,253,0.02) 100%)',
      },
      boxShadow: {
        'accent-glow': '0px 0px 10px #696aac, inset 0px 0px 2px rgba(255,255,255,0.61)',
        'accent-glow-lg': '0px 0px 25px #696aac, inset 0px 0px 6.69843px rgba(255,255,255,0.9)',
        'accent-soft': '0 0 40px rgba(105,106,172,0.20)',
        'card': '0 4px 24px rgba(0,0,0,0.5)',
        'modal': '0 25px 80px rgba(0,0,0,0.7)',
      },
      borderColor: {
        DEFAULT: 'rgba(246,246,253,0.10)',
        hover: 'rgba(246,246,253,0.20)',
        accent: 'var(--accent)',
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
        'slide-up': 'slide-up 0.45s ease forwards',
        'fade-in': 'fade-in 0.35s ease forwards',
        shimmer: 'shimmer 2s linear infinite',
        'aurora-1': 'aurora-1 14s ease-in-out infinite',
        'aurora-2': 'aurora-2 17s ease-in-out infinite',
        'aurora-3': 'aurora-3 20s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.9' },
        },
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'aurora-1': {
          '0%, 100%': { transform: 'translate(0,0) scale(1)' },
          '33%': { transform: 'translate(3%,-2%) scale(1.04)' },
          '66%': { transform: 'translate(-2%,3%) scale(0.97)' },
        },
        'aurora-2': {
          '0%, 100%': { transform: 'translate(0,0) scale(1)' },
          '33%': { transform: 'translate(-4%,2%) scale(1.07)' },
          '66%': { transform: 'translate(3%,-3%) scale(0.95)' },
        },
        'aurora-3': {
          '0%, 100%': { transform: 'translate(0,0) scale(1)' },
          '50%': { transform: 'translate(2%,4%) scale(1.03)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
