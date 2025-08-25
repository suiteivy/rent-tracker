/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        // Airbnb Color Palette
        'airbnb': {
          50: '#f7f7f7',
          100: '#e1e1e1', 
          200: '#cfcfcf',
          300: '#b1b1b1',
          400: '#9e9e9e',
          500: '#7e7e7e',
          600: '#626262',
          700: '#515151',
          800: '#434343',
          900: '#222222',
        },
        'airbnb-red': {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ff385c', // Airbnb's signature red
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        'airbnb-blue': {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        'airbnb-green': {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        'airbnb-purple': {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7c3aed',
          800: '#6b21a8',
          900: '#581c87',
        }
      },
      fontFamily: {
        'airbnb': ['Circular', '-apple-system', 'BlinkMacSystemFont', 'Roboto', 'Helvetica Neue', 'sans-serif'],
      },
      boxShadow: {
        'airbnb': '0 2px 16px rgba(0, 0, 0, 0.12)',
        'airbnb-lg': '0 4px 24px rgba(0, 0, 0, 0.12)',
        'airbnb-xl': '0 8px 32px rgba(0, 0, 0, 0.12)',
        'airbnb-glow': '0 0 20px rgba(255, 56, 92, 0.15)',
      },
      borderRadius: {
        'airbnb': '12px',
        'airbnb-lg': '16px',
      }
    },
  },
  plugins: [],
}