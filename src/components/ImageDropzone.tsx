import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

interface ImageDropzoneProps {
  onFilesSelected: (files: File[]) => void;
}

const ImageDropzone: React.FC<ImageDropzoneProps> = ({ onFilesSelected }) => {
  const [fileNames, setFileNames] = useState<string[]>([]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setFileNames(acceptedFiles.map((file) => file.name));
      onFilesSelected(acceptedFiles);
    },
    [onFilesSelected]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [],
    },
    multiple: true,
  });

  return (
    <div className="mb-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed ${
          isDragActive ? "border-primary bg-accent2" : "border-secondary"
        } rounded-lg p-4 text-center cursor-pointer transition-colors duration-300 hover:bg-accent2`}
      >
        <input {...getInputProps()} />

        <p className="text-primary mb-2">
          {isDragActive
            ? "Drop the images here..."
            : "Drag & drop images here, or click to select"}
        </p>

        <button
          type="button"
          className="bg-accent text-primary font-bold py-2 px-4 rounded-full border-2 border-contrast hover:scale-105 transition-transform duration-300"
        >
          Select Images
        </button>
      </div>

      {fileNames.length > 0 && (
        <div className="mt-3">
          <p className="text-primary text-sm font-medium">
            Selected files ({fileNames.length}):
          </p>
          <div className="max-h-24 overflow-y-auto mt-1">
            {fileNames.map((name, index) => (
              <p key={index} className="text-secondary text-xs italic truncate">
                {name}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageDropzone;
