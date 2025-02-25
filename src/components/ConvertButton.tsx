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
        relative w-full max-w-xs py-3.5 px-6 rounded-xl font-semibold text-white text-sm
        overflow-hidden transition-all duration-300
        ${
          disabled
            ? "opacity-70 cursor-not-allowed"
            : "hover:shadow-elevation-3 hover:scale-102 active:scale-98"
        }
      `}
      style={{
        background:
          "linear-gradient(45deg, var(--brand-500), var(--brand-400))",
      }}
      aria-label="Convert and download the image as the selected type"
    >
      <div className="relative z-10 flex items-center justify-center">
        {disabled ? (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        ) : (
          <svg
            className="w-4 h-4 mr-2"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
        )}
        <span>{disabled ? "Converting..." : "Convert & Download"}</span>
      </div>

      {/* animated gradient background */}
      <div
        className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300"
        style={{
          background:
            "linear-gradient(-45deg, var(--brand-600), var(--brand-400), var(--brand-300), var(--brand-500))",
          backgroundSize: "400% 400%",
          animation: "shimmer 3s linear infinite",
        }}
      />

      {/* button shine fx */}
      <div
        className="absolute inset-0 opacity-0 hover:opacity-30"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
          transform: "translateX(-100%)",
          animation: disabled ? "none" : "shimmer 2s infinite",
        }}
      />
    </button>
  );
};

export default ConvertButton;
