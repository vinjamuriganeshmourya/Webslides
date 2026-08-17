import type { Config } from 'tailwindcss'

/**
 * "NxtWave Evolve" — an original educational design theme.
 *
 * The PPTX is used only as a *structural* reference (which slide types
 * exist). Colours, characters, typography and layout are all new and
 * tuned for educational content delivery: high legibility, a calm
 * trustworthy primary, an energetic accent for emphasis/CTAs, and clear
 * semantic colours for callouts.
 */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          /* Primary — electric-but-trustworthy blue */
          50: '#EAF1FF',
          100: '#D6E4FF',
          200: '#AEC8FF',
          300: '#7FA6FF',
          400: '#4C80FF',
          500: '#0B5FFF', // PRIMARY
          600: '#0A44C2',
          700: '#083296',
          800: '#082873',
          900: '#0B1F52',
          DEFAULT: '#0B5FFF',
        },
        teal: {
          50: '#E6FAF7',
          100: '#C7F2EC',
          300: '#6FD9CE',
          400: '#33C6B7',
          500: '#12B5A8', // SECONDARY
          600: '#0E9285',
          700: '#0B6F66',
          DEFAULT: '#12B5A8',
        },
        accent: {
          50: '#FFF2E8',
          100: '#FFE1CC',
          300: '#FFB585',
          400: '#FF9E5C',
          500: '#FF8A3D', // ACCENT
          600: '#E5732A',
          700: '#B9591E',
          DEFAULT: '#FF8A3D',
        },
        success: { DEFAULT: '#16A34A', 100: '#DCFCE7', 600: '#15803D' },
        warning: { DEFAULT: '#F59E0B', 100: '#FEF3C7', 600: '#B45309' },
        danger: { DEFAULT: '#EF4444', 100: '#FEE2E2', 600: '#B91C1C' },
        info: { DEFAULT: '#0EA5E9', 100: '#E0F2FE', 600: '#0369A1' },
        ink: {
          DEFAULT: '#0B1A2B', // headings / strong text
          soft: '#1E3048',
        },
        body: {
          DEFAULT: '#4A5B6B', // paragraph text
          soft: '#6B7A8A',
        },
        muted: '#8A99A8',
        line: '#D8E3F5',
        surface: {
          DEFAULT: '#F4F8FF',
          2: '#E8F0FF',
          card: '#FFFFFF',
        },
        night: {
          DEFAULT: '#081026', // dark section-slide base
          2: '#0C1A3A',
          3: '#122554',
        },
        /**
         * "New Theme 2027" — the NxtWave PPT Template palette from Figma
         * (Style Guide › 01 - Color). Used by the `@/slides/nw2027` layouts;
         * kept separate so the Evolve theme above is unaffected.
         */
        nw: {
          dark: '#002A4B', // PRIMARY · Style Guide/Primary-dark-blue
          blue: '#2D63FB', // PRIMARY
          deep: '#0146C7', // SECONDARY
          ink: '#1C1C1C', // SECONDARY / text
          surface: '#F7F7FA',
        },
      },
      fontFamily: {
        heading: ['Sora', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        /* Body face of the 2027 theme. */
        dm: ['"DM Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      /* Type scale locked to the 1280×720 slide canvas (fixed px). */
      fontSize: {
        kicker: ['15px', { lineHeight: '1.2', letterSpacing: '0.14em', fontWeight: '700' }],
        'slide-title': ['34px', { lineHeight: '1.12', fontWeight: '700' }],
        'slide-title-lg': ['44px', { lineHeight: '1.08', fontWeight: '800' }],
        hero: ['64px', { lineHeight: '1.02', fontWeight: '800' }],
        'body-xl': ['26px', { lineHeight: '1.45' }],
        'body-lg': ['22px', { lineHeight: '1.5' }],
        body: ['19px', { lineHeight: '1.6' }],
        'body-sm': ['16px', { lineHeight: '1.55' }],
        code: ['17px', { lineHeight: '1.6' }],
      },
      borderRadius: {
        card: '18px',
        xl2: '24px',
        pill: '999px',
      },
      boxShadow: {
        card: '0 10px 34px -14px rgba(11, 95, 255, 0.30)',
        'card-soft': '0 6px 24px -10px rgba(11, 26, 43, 0.16)',
        float: '0 26px 70px -24px rgba(11, 95, 255, 0.50)',
        glow: '0 0 0 6px rgba(11, 95, 255, 0.10)',
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #0B5FFF 0%, #2C74FF 55%, #12B5A8 130%)',
        'brand-soft': 'linear-gradient(160deg, #EAF1FF 0%, #F4F8FF 100%)',
        'accent-gradient': 'linear-gradient(135deg, #FF8A3D 0%, #FFB055 100%)',
        'night-gradient': 'radial-gradient(120% 120% at 15% 0%, #122554 0%, #0C1A3A 45%, #081026 100%)',
        'teal-gradient': 'linear-gradient(135deg, #12B5A8 0%, #0B5FFF 130%)',
      },
      keyframes: {
        'float-y': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(0.9)', opacity: '0.6' },
          '70%': { transform: 'scale(1.4)', opacity: '0' },
          '100%': { opacity: '0' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'float-y': 'float-y 6s ease-in-out infinite',
        'pulse-ring': 'pulse-ring 2.6s cubic-bezier(0.4,0,0.6,1) infinite',
        shimmer: 'shimmer 2.5s linear infinite',
      },
    },
  },
  plugins: [],
} satisfies Config
