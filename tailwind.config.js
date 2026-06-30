/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif']
      },
      colors: {
        primary: {
          DEFAULT: '#6C63FF',
          50:  '#F0EFFF',
          100: '#E2E0FF',
          200: '#C4C0FF',
          300: '#A7A1FF',
          400: '#8A81FF',
          500: '#6C63FF',
          600: '#4D43FF',
          700: '#2E23FF',
          800: '#1810E0',
          900: '#100BAA'
        },
        accent: {
          DEFAULT: '#00D4AA',
          50:  '#E0FFF9',
          100: '#B3FFF0',
          200: '#66FFE0',
          300: '#1AFFD1',
          400: '#00F0C0',
          500: '#00D4AA',
          600: '#00A885',
          700: '#007C62',
          800: '#005040',
          900: '#00241D'
        },
        surface: {
          DEFAULT: '#1A1A2E',
          50:  '#3A3A6E',
          100: '#333360',
          200: '#2C2C52',
          300: '#252544',
          400: '#1E1E38',
          500: '#1A1A2E',
          600: '#141425',
          700: '#0E0E1C',
          800: '#080813',
          900: '#02020A'
        },
        base: {
          DEFAULT: '#0A0A0F',
          50:  '#2A2A3F',
          100: '#232333',
          200: '#1C1C27',
          300: '#15151B',
          400: '#0F0F13',
          500: '#0A0A0F',
          600: '#07070B',
          700: '#040407',
          800: '#020203',
          900: '#000000'
        }
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #6C63FF 0%, #00D4AA 100%)',
        'gradient-surface': 'linear-gradient(180deg, #1A1A2E 0%, #0A0A0F 100%)'
      },
      boxShadow: {
        'primary': '0 4px 24px rgba(108, 99, 255, 0.35)',
        'accent':  '0 4px 24px rgba(0, 212, 170, 0.35)',
        'surface': '0 8px 32px rgba(0, 0, 0, 0.48)'
      }
    }
  },
  plugins: []
}