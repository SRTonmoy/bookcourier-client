/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  daisyui: {
    themes: ["light", "dark"],
  },
  plugins: [require("daisyui")],
};
