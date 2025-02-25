import React from "react";

interface ConvertButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

const ConvertButton: React.FC<ConvertButtonProps> = ({
  onClick,
  disabled = false,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        relative w-[90%] border-0 bg-black text-white cursor-pointer text-sm font-extrabold
        mb-3 uppercase tracking-wider rounded-full py-3 px-8 overflow-hidden
        transition-all duration-300
        ${disabled ? "opacity-50 cursor-not-allowed" : "hover:shadow-lg"}
        dark:after:bg-[linear-gradient(90deg,transparent_0,transparent_25%,var(--primary)_0,var(--primary)_50%,transparent_0,transparent_75%,var(--primary)_0)]
        dark:before:bg-[linear-gradient(90deg,var(--primary)_25%,transparent_0,transparent_50%,var(--primary)_0,var(--primary)_75%,transparent_0)]
        dark:hover:after:translate-y-0 dark:hover:before:translate-y-0
      `}
      aria-label="Convert and download the image as the selected type"
    >
      <span className="dark:mix-blend-difference relative z-10">
        Convert & Download
      </span>

      <span className="absolute inset-0 bg-[linear-gradient(90deg,var(--primary)_25%,transparent_0,transparent_50%,var(--primary)_0,var(--primary)_75%,transparent_0)] translate-y-full transition-transform duration-300 ease-in-out dark:hover:translate-y-0"></span>
      <span className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0,transparent_25%,var(--primary)_0,var(--primary)_50%,transparent_0,transparent_75%,var(--primary)_0)] -translate-y-full transition-transform duration-300 ease-in-out z-[-1] dark:hover:translate-y-0"></span>
    </button>
  );
};

export default ConvertButton;
