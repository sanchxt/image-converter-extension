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
    <div className="mb-4">
      <label className="block text-primary mb-2">Image Type:</label>
      <div className="relative w-full bg-accent2 h-8 flex justify-around items-center rounded-full">
        {IMAGE_FORMATS.map((format) => (
          <div
            key={format.id}
            className="relative flex-1 h-full flex justify-center items-center"
          >
            <input
              type="radio"
              id={format.id}
              name="img-format"
              className="format-radio hidden"
              checked={selectedFormat === format.id}
              onChange={() => onFormatChange(format.id)}
            />
            <label htmlFor={format.id} className="format-label">
              {format.label}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageFormatSelector;
