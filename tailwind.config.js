/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      fontFamily: {
        main: ["TRS-80 CoCoNut", "sans-serif"],
      },
      colors: {
        main: "#47ff01",
      },
      fontSize: {
        "2xl": "2rem",
      },
    },
  },
  plugins: [],
};
