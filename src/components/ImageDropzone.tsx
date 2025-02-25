import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

interface ImageDropzoneProps {
  onFilesSelected: (files: File[]) => void;
}

const ImageDropzone: React.FC<ImageDropzoneProps> = ({ onFilesSelected }) => {
  const [fileNames, setFileNames] = useState<string[]>([]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setFileNames(acceptedFiles.map(file => file.name));
      onFilesSelected(acceptedFiles);
    },
    [onFilesSelected],
  );

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: {
      "image/*": [],
    },
    multiple: true,
    noClick: true,
    noKeyboard: true,
  });

  return (
    <div className="space-y-3">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-xl p-6 text-center transition-all duration-300
          ${
            isDragActive
              ? "border-brand-400 bg-brand-400/5 scale-102"
              : "border-white/20 hover:border-white/40 bg-surface"
          }
        `}
      >
        <input {...getInputProps()} />

        <div className="flex flex-col items-center justify-center space-y-3">
          <div
            className={`p-3 rounded-full ${
              isDragActive ? "bg-brand-400/20" : "bg-surface-hover"
            }`}
          >
            <svg
              className={`w-8 h-8 ${
                isDragActive ? "text-brand-400" : "text-secondary"
              }`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
          </div>

          <div className="space-y-1">
            <p className="text-primary text-sm">
              {isDragActive ? "Drop images here..." : "Drag & drop images here"}
            </p>
            <p className="text-secondary text-xs">or</p>
          </div>

          <button
            type="button"
            onClick={open}
            className="btn-secondary py-2 px-4 text-sm"
          >
            Browse Files
          </button>
        </div>
      </div>

      {fileNames.length > 0 && (
        <div className="bg-surface rounded-xl p-3 border border-white/10 animate-slide-up">
          <div className="flex items-center justify-between mb-2">
            <p className="text-primary text-sm font-medium">
              Selected Files ({fileNames.length})
            </p>
            <button
              onClick={() => {
                setFileNames([]);
                onFilesSelected([]);
              }}
              className="text-xs text-secondary hover:text-error transition-colors duration-200"
            >
              Clear All
            </button>
          </div>

          <div className="max-h-32 overflow-y-auto pr-2 space-y-1.5">
            {fileNames.map((name, index) => (
              <div
                key={index}
                className="flex items-center space-x-2 text-secondary text-xs bg-black/10 p-2 rounded-lg"
              >
                <svg
                  className="w-3 h-3 flex-shrink-0"
                  xmlns="http://www.w3.org/2000/svg"
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
                <p className="truncate">{name}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageDropzone;
