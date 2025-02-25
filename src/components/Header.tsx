import React from "react";
import ThemeToggle from "./ThemeToggle";

interface HeaderProps {
  theme: "dark" | "light";
  toggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ theme, toggleTheme }) => {
  return (
    <header className="flex justify-between items-center px-2 py-1">
      <img src="/icons/logo-128.png" alt="Logo" className="w-20 h-20" />
      <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
    </header>
  );
};

export default Header;
