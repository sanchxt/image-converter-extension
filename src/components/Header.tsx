import React from "react";
import ThemeToggle from "./ThemeToggle";

interface HeaderProps {
  theme: "dark" | "light";
  toggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ theme, toggleTheme }) => {
  return (
    <header className="flex justify-between items-center py-4 px-2 animate-fade-in">
      <div className="flex items-center space-x-2">
        <img
          src="/icons/logo-128.png"
          alt="Logo"
          className="w-10 h-10 rounded-xl shadow-elevation-1"
        />
        <span className="font-bold text-primary text-base">
          Image Converter
        </span>
      </div>
      <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
    </header>
  );
};

export default Header;
