/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      colors: {
        ink: {
          900: "#070b16",
          800: "#0b1220",
          700: "#0f1727",
          600: "#111a2e",
          500: "#152138",
        },
        brand: {
          400: "#38bdf8",
          500: "#0ea5e9",
          600: "#6366f1",
        },
        accent2: "#818cf8",
      },
      boxShadow: {
        panel: "0 24px 60px rgba(0,0,0,0.45)",
        glow: "0 8px 28px rgba(56,189,248,0.35)",
      },
    },
  },
  plugins: [],
};
