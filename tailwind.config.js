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
        gainsboro: "#DEE2E6",
        red: "#FA4D4D",
        green: "#08A508",
        lightGrey: "#6C757D"
      },
      fontFamily: {
        firago: ["FiraGo", "sans-serif"],
      },
    },
  },
  plugins: [],
};
