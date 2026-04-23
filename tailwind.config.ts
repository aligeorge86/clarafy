import type { Config } from 'tailwindcss';

// Clarafy brand tokens — pulled directly from the v6 mockup.
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Primary brand
        coral: {
          DEFAULT: '#FF5C3A',
          soft: '#FFF0EB',
          border: '#FFD5C8',
        },
        // Background
        warm: '#FDF8F4',
        warmer: '#FFF8F4',
        // Text / ink
        ink: '#1C1C1C',
        // Supporting
        sage: '#8BAF7C',
        gold: '#C9963A',
        // Greys used in the mockup
        muted: '#888',
        hush: '#AAA',
        whisper: '#CCC',
        rule: '#EDE6DC',
        crust: '#E8DDD0',
      },
      fontFamily: {
        display: ['"Libre Baskerville"', 'Georgia', 'serif'],
        body: ['Nunito', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        coral: '0 3px 12px rgba(255, 92, 58, 0.28)',
        'coral-lg': '0 4px 16px rgba(255, 92, 58, 0.30)',
        'coral-hover': '0 8px 40px rgba(255, 92, 58, 0.08)',
      },
      letterSpacing: {
        tightest: '-2px',
        tighter: '-1px',
      },
    },
  },
  plugins: [],
};

export default config;
