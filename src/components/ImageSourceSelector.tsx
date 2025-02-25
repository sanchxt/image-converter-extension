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
    <div className="mb-4">
      <label
        htmlFor="image-src"
        className="block text-primary text-base mb-2 transition-all duration-300 hover:tracking-wider hover:underline hover:decoration-primary hover:underline-offset-3 hover:decoration-2"
      >
        Image Source
      </label>
      <select
        id="image-src"
        className="input-field"
        value={source}
        onChange={(e) => onSourceChange(e.target.value as ImageSource)}
        aria-label="Select image source (URL, or from your device)"
      >
        <option value="file">File</option>
        <option value="url">URL</option>
      </select>
    </div>
  );
};

export default ImageSourceSelector;
