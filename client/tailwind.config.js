/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2d3748",
        "hover-primary": "#4a5568",
        remove: "#DF2935",
        edit: "#4C9F70",
      },
    },
  },
  plugins: [require("flowbite/plugin")],
  darkMode: "class",
};
