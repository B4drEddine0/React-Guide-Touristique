/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ocean: {
          50: '#EFF8FF',
          100: '#D1ECFF',
          200: '#A6DAFF',
          300: '#58B9F5',
          400: '#1A9BE3',
          500: '#0077B6',
          600: '#005F94',
          700: '#004A73',
          800: '#003652',
          900: '#002338',
        },
        turquoise: {
          50: '#ECFEFF',
          100: '#CDFCFF',
          200: '#A1F3FC',
          300: '#67E4F5',
          400: '#22CCDE',
          500: '#00B4D8',
          600: '#0093B2',
          700: '#00748E',
          800: '#005C72',
          900: '#004558',
        },
        coral: {
          50: '#FFF5F2',
          100: '#FFE4DB',
          200: '#FFC4B0',
          300: '#FF9B7A',
          400: '#F27649',
          500: '#E76F51',
          600: '#C4543A',
          700: '#A3412C',
          800: '#83331F',
          900: '#6B2A19',
        },
        sand: {
          50: '#FDFAF6',
          100: '#F6F1EB',
          200: '#EDE4D8',
          300: '#DDD0BD',
          400: '#C8B79A',
        },
      },
      fontFamily: {
        heading: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      fontSize: {
        'hero': ['4rem', { lineHeight: '1.05', letterSpacing: '-0.03em', fontWeight: '800' }],
        'hero-sm': ['2.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '800' }],
        'display': ['2.75rem', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '700' }],
        'display-sm': ['2rem', { lineHeight: '1.15', letterSpacing: '-0.015em', fontWeight: '700' }],
      },
      borderRadius: {
        DEFAULT: '8px',
        sm: '6px',
        md: '8px',
        lg: '12px',
        xl: '16px',
        '2xl': '20px',
        '3xl': '24px',
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(0, 119, 182, 0.06)',
        'card': '0 4px 16px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 12px 32px rgba(0, 119, 182, 0.12)',
        'elevated': '0 16px 48px rgba(0, 0, 0, 0.10)',
        'glow': '0 0 40px rgba(0, 180, 216, 0.15)',
      },
      maxWidth: {
        'content': '1280px',
      },
      backgroundImage: {
        'gradient-ocean': 'linear-gradient(135deg, #0077B6 0%, #00B4D8 100%)',
        'gradient-coral': 'linear-gradient(135deg, #E76F51 0%, #F27649 100%)',
        'gradient-warm': 'linear-gradient(135deg, #F6F1EB 0%, #FDFAF6 100%)',
        'gradient-hero': 'linear-gradient(180deg, rgba(0,35,56,0.7) 0%, rgba(0,35,56,0.3) 50%, rgba(0,35,56,0.8) 100%)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s infinite linear',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
};
