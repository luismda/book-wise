/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
    './src/app/**/*.{ts,tsx}',
  ],
  theme: {
    fontFamily: {
      default: 'Nunito, sans-serif',
    },

    maxWidth: {
      16: '4rem',
    },

    spacing: {
      px: '1px',
      1: '0.25rem',
      2: '0.5rem',
      3: '0.75rem',
      4: '1rem',
      5: '1.25rem',
      6: '1.5rem',
      7: '1.75rem',
      8: '2rem',
      10: '2.5rem',
      13: '3.25rem',
      16: '4rem',
      18: '4.5rem',
      58: '14.5rem',
    },

    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      md: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
    },

    fontWeight: {
      regular: '400',
      medium: '500',
      bold: '700',
    },

    lineHeight: {
      shorter: '125%',
      short: '140%',
      base: '160%',
      tall: '180%',
    },

    colors: {
      black: '#000000',
      white: '#FFFFFF',
      transparent: 'transparent',

      green: {
        100: '#50B2C0',
        200: '#255D6A',
        300: '#0A313C',
      },

      purple: {
        100: '#8381D9',
        200: '#2A2879',
      },

      red: {
        400: '#F75A68',
      },

      gray: {
        100: '#F8F9FC',
        200: '#E6E8F2',
        300: '#D1D6E4',
        400: '#8D95AF',
        500: '#303F73',
        600: '#252D4A',
        700: '#181C2A',
        800: '#0E1116',
      },
    },

    backgroundImage: {
      'sidebar-gradient': 'url(/sidebar-gradient.png)',
      'gradient-vertical': `linear-gradient(180deg, #7FD1CC 0%, #9694F5 100%)`,
      'gradient-horizontal': `linear-gradient(90deg, #7FD1CC 0%, #9694F5 100%)`,
    },

    borderRadius: {
      px: '1px',
      xxs: '2.5px',
      xs: '4px',
      sm: '8px',
      md: '12px',
      lg: '20px',
      full: '99999px',
    },
  },
  plugins: [],
}
