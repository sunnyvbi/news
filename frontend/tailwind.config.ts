import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#F1EEE7",
        ink: "#15141A",
        panel: "#0D0C11",
        indigo: "#4B3F72",
        indigoDeep: "#342C52",
        bone: "#CFCAC0",
        pulse: "#D5FF4F",
      },
      fontFamily: {
        display: ["\"Space Grotesk\"", "sans-serif"],
        body: ["Spectral", "serif"],
      },
      fontSize: {
        "clamp-hero": "clamp(2.75rem, 8vw, 7.5rem)",
        "clamp-h2": "clamp(2rem, 5vw, 4rem)",
      },
    },
  },
  plugins: [],
} satisfies Config;
