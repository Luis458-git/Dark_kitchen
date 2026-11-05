/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        noir: {
          950: '#0D0E12',
          900: '#121317',
          850: '#16171D',
          800: '#1A1B20',
          700: '#282A33',
          600: '#353844',
          500: '#4B5061'
        },
        gold: {
          300: '#F2DE8A',
          400: '#E6CA65',
          500: '#E5C158',
          600: '#C7A238',
          700: '#9B7C22'
        },
        brand: {
          primary: '#F5F6F8',
          secondary: '#8B95A9',
          muted: '#5B6579'
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Bodoni Moda', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'Menlo', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        'gold-glow': '0 0 25px -5px rgba(230, 202, 101, 0.25)',
        'obsidian': '0 20px 40px -15px rgba(0, 0, 0, 0.7)'
      }
    },
  },
  plugins: [],
}

