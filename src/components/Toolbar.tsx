import React from "react";
import { ThemeType } from "../types";
import ThemeToggle from "./ThemeToggle";

interface ToolbarProps {
  theme: ThemeType;
  toggleTheme: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ theme, toggleTheme }) => {
  // TODO: implement these functions later
  const handleUndo = () => {
    // Implement undo functionality
    console.log("Undo clicked");
  };

  const handleRedo = () => {
    // Implement redo functionality
    console.log("Redo clicked");
  };

  const handleHelp = () => {
    // Show keyboard shortcuts or help
    console.log("Help clicked");
  };

  const handleVoice = () => {
    // Toggle voice commands
    console.log("Voice toggle clicked");
  };

  return (
    <div className="flex items-center justify-between w-full mb-2">
      <div className="flex items-center space-x-1">
        <button
          onClick={handleUndo}
          className="p-1.5 rounded-lg text-secondary hover:text-primary hover:bg-surface transition-all duration-300"
          title="Undo (Ctrl+Z)"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M3 10h10a4 4 0 0 1 0 8H9"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M3 10l3-3m-3 3l3 3"
            />
          </svg>
        </button>
        <button
          onClick={handleRedo}
          className="p-1.5 rounded-lg text-secondary hover:text-primary hover:bg-surface transition-all duration-300"
          title="Redo (Ctrl+Y)"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M21 10h-10a4 4 0 0 0 0 8h4"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M21 10l-3-3m3 3l-3 3"
            />
          </svg>
        </button>
      </div>

      <div className="flex items-center space-x-1">
        <button
          onClick={handleHelp}
          className="p-1.5 rounded-lg text-secondary hover:text-primary hover:bg-surface transition-all duration-300"
          title="Keyboard Shortcuts"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </button>
        <button
          onClick={handleVoice}
          className="p-1.5 rounded-lg text-secondary hover:text-primary hover:bg-surface transition-all duration-300"
          title="Voice Commands (Experimental)"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
            />
          </svg>
        </button>
        <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
      </div>
    </div>
  );
};

export default Toolbar;
