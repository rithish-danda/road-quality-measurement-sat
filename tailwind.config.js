/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      animation: {
        'spin-slow': 'spin 20s linear infinite',
      },
      cursor: {
        satellite: 'url("/cursor-satellite.png"), pointer',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};