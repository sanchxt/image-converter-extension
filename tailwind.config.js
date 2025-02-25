module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./src/index.html"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "var(--primary)",
        secondary: "var(--secondary)",
        contrast: "var(--contrast)",
        accent: "var(--accent)",
        accent2: "var(--accent2)",
        format: "var(--format)",
      },
      fontFamily: {
        nunito: ["Nunito", "sans-serif"],
      },
      animation: {
        glow: "glow 1.4s ease-in-out 0.7s infinite alternate",
      },
      keyframes: {
        glow: {
          from: {
            textShadow:
              "0px 0px 5px rgba(255, 255, 255, 0.1), 0px 0px 5px rgba(205, 157, 250, 0.2)",
          },
          to: {
            textShadow:
              "0px 0px 20px rgba(255, 255, 255, 0.2), 0px 0px 20px rgba(205, 157, 250, 0.4)",
          },
        },
      },
    },
  },
  plugins: [],
};
