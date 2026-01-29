/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        'terminal': {
          bg: '#0a0e17',
          card: '#111827',
          border: '#1f2937',
          hover: '#1a2332',
        }
      }
    },
  },
  plugins: [],
}
