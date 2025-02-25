import React from "react";

interface ThemeToggleProps {
  theme: "dark" | "light";
  toggleTheme: () => void;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, toggleTheme }) => {
  return (
    <div className="p-0 mt-2">
      <button
        onClick={toggleTheme}
        className="flex items-center gap-1 py-1.5 px-3 rounded-xl border-none bg-contrast text-primary cursor-pointer"
        aria-label="Toggle between dark and light theme"
      >
        <span
          className={`font-bold px-1 py-2 ${
            theme === "dark" ? "underline decoration-2 underline-offset-4" : ""
          }`}
        >
          Dark
        </span>
        <span>|</span>
        <span
          className={`font-bold px-1 py-2 ${
            theme === "light" ? "underline decoration-2 underline-offset-4" : ""
          }`}
        >
          Light
        </span>
      </button>
    </div>
  );
};

export default ThemeToggle;
