import React, { useState, useEffect } from "react";

interface ImagePreviewProps {
  imageSource: File | string | null;
  isFullscreen?: boolean;
  isProcessing?: boolean;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({
  imageSource,
  isFullscreen = false,
  isProcessing = false,
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    if (!imageSource) {
      setPreviewUrl(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    const loadImage = async () => {
      try {
        let url;

        if (typeof imageSource === "string") {
          url = imageSource;
        } else {
          url = URL.createObjectURL(imageSource);
        }

        setPreviewUrl(url);
      } catch (err) {
        console.error("Error creating preview:", err);
        setError("Failed to load image preview");
      } finally {
        setIsLoading(false);
      }
    };

    loadImage();

    return () => {
      if (previewUrl && typeof imageSource !== "string") {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [imageSource]);

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.25, 0.25));
  };

  const handleResetZoom = () => {
    setZoom(1);
  };

  if (!imageSource) {
    return (
      <div
        className={`flex flex-col items-center justify-center ${
          isFullscreen ? "h-full" : "h-64"
        } bg-surface/50 rounded-xl border border-white/10`}
      >
        <div className="p-4 rounded-full bg-surface/80">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-secondary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        <p className="mt-4 text-secondary text-sm">No image selected</p>
        <p className="text-secondary text-xs">Select an image to preview</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div
        className={`flex flex-col items-center justify-center ${
          isFullscreen ? "h-full" : "h-64"
        } bg-surface/50 rounded-xl border border-white/10`}
      >
        <svg
          className="animate-spin h-8 w-8 text-brand-400"
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
        <p className="mt-4 text-secondary text-sm">Loading image preview...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`flex flex-col items-center justify-center ${
          isFullscreen ? "h-full" : "h-64"
        } bg-error/10 rounded-xl border border-error/20`}
      >
        <div className="p-4 rounded-full bg-error/20">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-error"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <p className="mt-4 text-error text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div
      className={`${
        isFullscreen ? "h-full" : "h-64"
      } relative overflow-hidden bg-surface/50 rounded-xl border border-white/10`}
    >
      <div className="absolute inset-0 flex items-center justify-center overflow-auto">
        {previewUrl && (
          <img
            src={previewUrl}
            alt="Preview"
            className="transition-transform duration-300 ease-out"
            style={{ transform: `scale(${zoom})` }}
          />
        )}
      </div>

      {isProcessing && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-10">
          <div className="flex flex-col items-center space-y-2">
            <svg
              className="animate-spin h-8 w-8 text-brand-400"
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
            <p className="text-white text-sm">Updating preview...</p>
          </div>
        </div>
      )}

      <div className="absolute bottom-2 right-2 flex items-center space-x-1 bg-accent/80 backdrop-blur-sm rounded-lg p-1 shadow-elevation-1">
        <button
          onClick={handleZoomOut}
          className="p-1.5 rounded-md text-secondary hover:text-primary hover:bg-surface transition-all duration-300"
          title="Zoom Out"
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
              d="M20 12H4"
            />
          </svg>
        </button>

        <button
          onClick={handleResetZoom}
          className="p-1.5 rounded-md text-secondary hover:text-primary hover:bg-surface transition-all duration-300"
          title="Reset Zoom"
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
              d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
            />
          </svg>
        </button>

        <button
          onClick={handleZoomIn}
          className="p-1.5 rounded-md text-secondary hover:text-primary hover:bg-surface transition-all duration-300"
          title="Zoom In"
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
              d="M12 4v16m8-8H4"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ImagePreview;
