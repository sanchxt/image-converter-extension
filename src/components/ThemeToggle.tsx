import React from "react";
import { ThemeType } from "../types";

interface ThemeToggleProps {
  theme: ThemeType;
  toggleTheme: () => void;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, toggleTheme }) => {
  return (
    <button
      onClick={toggleTheme}
      className="glass p-1.5 rounded-full flex items-center focus:outline-none focus:ring-2 focus:ring-brand-400/30 transition-all duration-300"
      aria-label="Toggle between dark and light theme"
    >
      {theme === "dark" ? (
        <div className="flex items-center space-x-1">
          <span className="bg-brand-400 text-white rounded-full p-1.5 transform transition-transform duration-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
              />
            </svg>
          </span>
          <span className="text-primary text-xs pr-1">Dark</span>
        </div>
      ) : (
        <div className="flex items-center space-x-1">
          <span className="bg-brand-400 text-white rounded-full p-1.5 transform transition-transform duration-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          </span>
          <span className="text-primary text-xs pr-1">Light</span>
        </div>
      )}
    </button>
  );
};

export default ThemeToggle;
