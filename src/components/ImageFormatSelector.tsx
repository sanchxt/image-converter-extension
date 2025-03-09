import React from "react";
import { IMAGE_FORMATS } from "../utils/constants";
import { ImageFormat } from "../types";

interface ImageFormatSelectorProps {
  selectedFormat: ImageFormat;
  onFormatChange: (format: ImageFormat) => void;
}

const ImageFormatSelector: React.FC<ImageFormatSelectorProps> = ({
  selectedFormat,
  onFormatChange,
}) => {
  return (
    <div className="space-y-2">
      <div className="relative w-full bg-accent/50 h-12 flex gap-2 rounded-2xl shadow-inner-glow overflow-hidden px-2">
        {IMAGE_FORMATS.map(format => (
          <div key={format.id} className="relative flex-1 h-full">
            <input
              type="radio"
              id={format.id}
              name="img-format"
              className="format-radio hidden"
              checked={selectedFormat === format.id}
              onChange={() => onFormatChange(format.id)}
            />
            <label
              htmlFor={format.id}
              className={`format-label ${
                selectedFormat === format.id ? "text-white" : ""
              }`}
            >
              <div className="flex flex-col items-center justify-center">
                <span className="text-xs font-medium">{format.label}</span>
                {format.id === selectedFormat && (
                  <span className="text-[0.58rem] opacity-75">
                    {format.id === "png"}
                    {format.id === "jpg"}
                    {format.id === "webp"}
                    {format.id === "avif"}
                    {format.id === "heic"}
                  </span>
                )}
              </div>
            </label>
          </div>
        ))}
      </div>

      <div className="bg-surface rounded-lg p-3 text-xs text-secondary italic">
        {selectedFormat === "png" && (
          <p>
            PNG provides high quality with transparency support. Best for
            graphics and logos.
          </p>
        )}
        {selectedFormat === "jpg" && (
          <p>
            JPG offers good quality with smaller file sizes. Ideal for
            photographs and complex images.
          </p>
        )}
        {selectedFormat === "webp" && (
          <p>
            WebP delivers excellent compression with transparency support.
            Perfect for web use.
          </p>
        )}
        {selectedFormat === "avif" && (
          <p>
            AVIF provides superior compression and quality. Best for modern
            browsers and apps.
          </p>
        )}
        {selectedFormat === "heic" && (
          <p>
            HEIC is Apple's format with excellent compression. Ideal for iPhone
            photos.
          </p>
        )}
      </div>
    </div>
  );
};

export default ImageFormatSelector;
