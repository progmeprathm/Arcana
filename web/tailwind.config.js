/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: {
          950: '#0a0b0d',
          900: '#121316',
          800: '#1b1d22',
          700: '#262930',
          600: '#343842'
        },
        vellum: {
          50: '#fcfbf8',
          100: '#F4F1EA',
          200: '#e7e1d2',
          300: '#d5cca9'
        },
        sage: {
          400: '#758c6e',
          500: '#5E7058',
          600: '#485643',
          700: '#343e31'
        },
        gold: {
          300: '#f0cf65',
          400: '#e5be40',
          500: '#D4AF37',
          600: '#b08f25',
          700: '#8c7017'
        }
      },
      fontFamily: {
        serif: ['Cinzel', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
