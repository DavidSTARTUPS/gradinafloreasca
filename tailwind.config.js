/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        serif: ["Playfair Display", "serif"],
      },
      colors: {
        brand: {
          bg: "#F8F7F5",
          dark: "#0F1318",
          accent: "#C8A96E",
          accentHover: "#B8955A",
          teal: "#2A6B70",
          textMain: "#222222",
          textMuted: "#777777",
          border: "#EAEAEA",
        },
      },
      boxShadow: {
        glow: "0 8px 32px rgba(200, 169, 110, 0.25)",
        float: "0 -16px 40px rgba(0, 0, 0, 0.8)",
      },
    },
  },
  plugins: [],
}
