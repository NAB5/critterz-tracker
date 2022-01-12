const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  mode: "jit",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./sections/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ["Fira Code", ...defaultTheme.fontFamily.mono],
      },
      minHeight: {
        banner: "300px",
      },
      maxHeight: {
        banner: "300px",
      },
      maxWidth: {
        "8xl": "87.5rem" /* 1400 px */,
      },
      colors: {
        darkgreen: "#01150A",
        offwhite: "#BCBCBC",
        black: "#171717",
        red: "#CF5B5B",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
