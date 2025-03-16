/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"], // Adjust based on your project
  theme: {
    extend: {
      colors: {
        polarDark: '#2e3440',
        polarMed1: '#3b4252',
        polarMed2: '#434c5e',
        polarLight: '#4c566a',
        snowDark: '#c4cad5',
        snowMid1: '#d8dee9',
        snowMid2: '#e5e9f0',
        snowLight: '#eceff4',
      },
    },
  },
  plugins: [],
};
