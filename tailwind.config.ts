import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/features/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#0B132B',
          charcoal: '#0F172A',
          slate: '#1E293B',
          gold: '#C59B27',
          'gold-light': '#D4AF37',
          'gold-dark': '#9A7718',
          'gold-soft': '#FEF9E7',
          beige: '#FBFBF9',
          cream: '#F7F6F2',
          surface: '#F8FAFC',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
      },
      boxShadow: {
        luxury: '0 10px 30px -5px rgba(11, 19, 43, 0.08), 0 4px 6px -2px rgba(11, 19, 43, 0.04)',
        'luxury-hover': '0 20px 40px -10px rgba(11, 19, 43, 0.15), 0 8px 10px -4px rgba(11, 19, 43, 0.06)',
      },
    },
  },
  plugins: [],
};

export default config;
