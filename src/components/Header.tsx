import React from "react";

import { ThemeType } from "../types";

interface HeaderProps {
  theme: ThemeType;
  toggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = () => {
  return (
    <header className="flex justify-between items-center py-4 px-2 animate-fade-in">
      <div className="flex items-center space-x-2">
        <img
          src="/icons/logo-128.png"
          alt="Logo"
          className="w-10 h-10 rounded-xl shadow-elevation-1"
        />
        <div className="flex flex-col">
          <span className="font-bold text-primary text-base leading-tight">
            Image Converter
          </span>
          <span className="text-secondary text-xs">v1.4.0</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
