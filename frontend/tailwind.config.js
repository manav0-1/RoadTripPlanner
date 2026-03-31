const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'cars24-blue': '#164489',
        'cars24-secondary': '#f3f4f6',
        'cars24-accent-orange': '#f7931e',
      },
      fontFamily: {
        sans: ['Manrope', ...defaultTheme.fontFamily.sans],
        display: ['Space Grotesk', ...defaultTheme.fontFamily.sans],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-delayed': 'float 6s ease-in-out 2s infinite',
        'pulse-ring': 'pulse-ring 2s ease-out infinite',
        'spin-slow': 'spin 8s linear infinite',
      },
      borderColor: {
        'white/12': 'rgba(255, 255, 255, 0.12)',
      },
    },
  },
  plugins: [],
};
