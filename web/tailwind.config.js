/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#060B13',
          900: '#0A1220',
          850: '#0E1A2E',
          800: '#14233C',
          700: '#1F3456',
        }
      }
    },
  },
  plugins: [],
}
