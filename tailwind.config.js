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
        secondary: "#dd382f",
        accent: "#a8d0da",
        light: "#f5f6fa",
        dark: {
          DEFAULT: "#201e2f",
          red: "#dd382f"
        },
        success: "#B7E5B4",
        info: "#79B8D1",
        danger: "#FF8A8A",
        warning: "#FFFC9B", 
        muted: "#5f6168"
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
