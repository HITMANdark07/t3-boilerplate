/** @type {import("tailwindcss").Config} */
const config = {
  content: ["./src/**/*.tsx"],
  // @ts-ignore
  presets: [require("@app/tailwind-config")],
  plugins: [require("daisyui"), require("tailwind-scrollbar-hide")],
};

module.exports = config;
