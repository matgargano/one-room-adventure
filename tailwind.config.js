/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      fontFamily: {
        coconut: ["TRS-80 CoCoNut", "sans-serif"],
        start: ["Start"],
        vt323: ["VT323", "sans-serif"],
      },
      colors: {
        main: "#47ff01",
      },
      fontSize: {
        "2xl": "2rem",
      },
    },
  },
  safelist: [
    {
      pattern:
        /^bg-(blue|red|yellow|orange|green)-(50|100|200|300|400|500|600|700|800|900)$/,
    },
  ],
  plugins: [
    function ({ addVariant, theme }) {
      addVariant("mobile-only", ({ container }) => {
        const lgBreakpoint = theme("screens.lg");
        const maxWidth = parseInt(lgBreakpoint) - 1;
        return container.walkRules((rule) => {
          rule.selector = `@media (max-width: ${maxWidth}px) { ${rule.selector} }`;
        });
      });
    },
  ],
};
