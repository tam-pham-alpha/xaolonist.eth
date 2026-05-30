/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
    "./src/templates/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkmode: "var(--darkmode, #0B0B0F)",
        textColor: "var(--text-color, white)",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      screens: {
        // match existing styled-components breakpoints
        'sm': '640px',
        'md': '768px',
        'lg': '992px',
        'xl': '1200px',
      }
    },
  },
  plugins: [],
}
