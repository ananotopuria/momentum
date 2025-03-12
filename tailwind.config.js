/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        white: "#fff",
        black: "#000",
        blueViolet: "#8338EC",
        grey: "#212529",
      },
      fontFamily: {
        firago: ["FiraGo", "sans-serif"],
      },
    },
  },
  plugins: [],
};
