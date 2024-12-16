/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['NTR', 'sans-serif'], // Set NTR as the default sans font
      },
    },
  },
  plugins: [],
}