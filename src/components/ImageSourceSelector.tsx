import React from "react";
import { ImageSource } from "../types";

interface ImageSourceSelectorProps {
  source: ImageSource;
  onSourceChange: (source: ImageSource) => void;
}

const ImageSourceSelector: React.FC<ImageSourceSelectorProps> = ({
  source,
  onSourceChange,
}) => {
  return (
    <div className="space-y-2">
      <label className="block text-primary font-medium text-sm">
        Image Source
      </label>

      <div className="flex rounded-xl overflow-hidden border border-white/10 p-1 bg-accent">
        <button
          type="button"
          onClick={() => onSourceChange("file")}
          className={`flex items-center justify-center space-x-1.5 py-2 px-3 rounded-lg text-sm font-medium flex-1 transition-all duration-300 ${
            source === "file"
              ? "bg-brand-400 text-white shadow-elevation-1"
              : "text-secondary hover:text-primary hover:bg-surface"
          }`}
        >
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
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span>Device</span>
        </button>

        <button
          type="button"
          onClick={() => onSourceChange("url")}
          className={`flex items-center justify-center space-x-1.5 py-2 px-3 rounded-lg text-sm font-medium flex-1 transition-all duration-300 ${
            source === "url"
              ? "bg-brand-400 text-white shadow-elevation-1"
              : "text-secondary hover:text-primary hover:bg-surface"
          }`}
        >
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
              d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
            />
          </svg>
          <span>URL</span>
        </button>
      </div>
    </div>
  );
};

export default ImageSourceSelector;
