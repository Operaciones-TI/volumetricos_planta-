/** @type {import('tailwindcss').Config} */
const plugin = require("tailwindcss/plugin");
module.exports = {
  darkMode: "selector",
  content: ["./src/**/*.{html,ts}", "./src/app/*.{html,ts}"],
  theme: {
    extend: {
      fontFamily: {
        Poppins: ["Poppins", "sans-serif"],
      },
      colors: {
        primary: "#406d96",
        secondary: "#e2474b",
        accent: "#a8d0da",
        light: "#d8e8e8",
        dark: "#2f3a56",
        success: "#B7E5B4",
        info: "#79B8D1",
        danger: "#FF8A8A",
        warning: "#FFFC9B", 
      }
    },
  },
  plugins: [
    plugin(function ({ addBase, theme }) {
      addBase({
        h1: {
          fontSize: theme("fontSize.3xl"),
          fontWeight: theme("fontWeight.bold"),
        },
        h2: {
          fontSize: theme("fontSize.2xl"),
          fontWeight: theme("fontWeight.bold"),
        },
        h3: {
          fontSize: theme("fontSize.lg"),
          fontWeight: theme("fontWeight.bold"),
        },
        h4: {
          fontSize: theme("fontSize.md"),
          fontWeight: theme("fontWeight.bold")
        }
      });
    })
  ],
};
