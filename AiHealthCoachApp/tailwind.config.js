/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require("nativewind/preset")],
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#39FF14",
        background: "#050505",
        secondary: "#171717",
        "secondary-text": "#a3a3a3",
        border: "#2a2a2a",
        whiteText: "#f5f5f5",
      },
    },
  },
  plugins: [],
};