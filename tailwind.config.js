/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#9E7FFF",
        secondary: "#38bdf8",
        accent: "#f472b6",
        background: "#111113",
        surface: "#1A1A1D",
        text: "#FFFFFF",
        'text-secondary': "#A3A3A3",
        border: "#2F2F2F",
        success: "#10b981",
        warning: "#f59e0b",
        error: "#ef4444",
      },
      borderRadius: {
        'lg': '1rem',
        'xl': '1.5rem',
      },
      boxShadow: {
        'glow-primary': '0 0 20px 0 rgba(158, 127, 255, 0.3)',
        'glow-accent': '0 0 20px 0 rgba(244, 114, 182, 0.3)',
      }
    },
  },
  plugins: [],
}
