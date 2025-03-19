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
        lightGrey: "#6C757D",
        darkGrey: "#343A40",
        lavender: "#DDD2FF",
        yellow: "#FFBE0B",
        darkerGrey: "#474747",
        lighterGrey: "#CED4DA",
        blackish: "#0D0F10",
        brightLavender: "#B588F4"
      },
      fontFamily: {
        firago: ["FiraGo", "sans-serif"],
      },
    },
  },
  plugins: [],
};
