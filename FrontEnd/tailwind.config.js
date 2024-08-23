/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "selector",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        sun: "inset 0 0 0.7rem 0.015rem #f6e05e, 0 0 1rem 0.2rem #f6e05e",
        form: "inset 0 0 0.2rem 0.04rem rgba(0, 0, 0, 0.35)",
      },
    },
  },
  plugins: [],
};
