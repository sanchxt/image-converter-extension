import React from "react";
import { TabId } from "../types/tabs.types";
import ImageSourceSelector from "./ImageSourceSelector";
import ImageDropzone from "./ImageDropzone";
import ImageFormatSelector from "./ImageFormatSelector";
import ConvertButton from "./ConvertButton";
import { ImageFormat, ImageSource } from "../types";

interface TabContentProps {
  activeTab: TabId;
}

const TabContent: React.FC<
  TabContentProps & {
    imageSource: ImageSource;
    url: string;
    handleUrlChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSourceChange: (source: ImageSource) => void;
    files: File[];
    onFilesSelected: (files: File[]) => void;
    selectedFormat: ImageFormat;
    handleFormatChange: (format: ImageFormat) => void;
    handleConvert: () => void;
    isConverting: boolean;
    status: string;
    progress: number;
  }
> = ({
  activeTab,
  imageSource,
  url,
  handleUrlChange,
  handleSourceChange,
  files,
  onFilesSelected,
  selectedFormat,
  handleFormatChange,
  handleConvert,
  isConverting,
  status,
  progress,
}) => {
  // render content based on active tab
  switch (activeTab) {
    case "convert":
      return (
        <ConvertTabContent
          imageSource={imageSource}
          url={url}
          handleUrlChange={handleUrlChange}
          handleSourceChange={handleSourceChange}
          files={files}
          onFilesSelected={onFilesSelected}
          selectedFormat={selectedFormat}
          handleFormatChange={handleFormatChange}
          handleConvert={handleConvert}
          isConverting={isConverting}
          status={status}
          progress={progress}
        />
      );
    case "edit":
      return <EditTabContent />;
    case "crop":
      return <CropTabContent />;
    case "compress":
      return <CompressTabContent />;
    case "metadata":
      return <MetadataTabContent />;
    case "compare":
      return <CompareTabContent />;
    default:
      return <div>Select a tab</div>;
  }
};

// convert Tab Content
const ConvertTabContent: React.FC<{
  imageSource: ImageSource;
  url: string;
  handleUrlChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSourceChange: (source: ImageSource) => void;
  files: File[];
  onFilesSelected: (files: File[]) => void;
  selectedFormat: ImageFormat;
  handleFormatChange: (format: ImageFormat) => void;
  handleConvert: () => void;
  isConverting: boolean;
  status: string;
  progress: number;
}> = ({
  imageSource,
  url,
  handleUrlChange,
  handleSourceChange,
  files,
  onFilesSelected,
  selectedFormat,
  handleFormatChange,
  handleConvert,
  isConverting,
  status,
  progress,
}) => {
  return (
    <div className="space-y-4">
      <div className="card p-5 space-y-5 animate-scale-in animate-stagger-1">
        <ImageSourceSelector
          source={imageSource}
          onSourceChange={handleSourceChange}
        />

        {imageSource === "url" ? (
          <div className="space-y-2 animate-fade-in">
            <label
              htmlFor="image-url"
              className="block text-primary font-medium text-sm"
            >
              Image URL
            </label>
            <input
              type="text"
              id="image-url"
              value={url}
              onChange={handleUrlChange}
              className="input-field"
              placeholder="Enter the URL to an image"
              aria-required="true"
            />
          </div>
        ) : (
          <ImageDropzone onFilesSelected={onFilesSelected} />
        )}
      </div>

      <div className="card p-5 space-y-4 animate-scale-in animate-stagger-2">
        <h2 className="text-primary font-medium text-sm">Output Format</h2>
        <ImageFormatSelector
          selectedFormat={selectedFormat}
          onFormatChange={handleFormatChange}
        />
      </div>

      <div className="flex flex-col items-center space-y-3 animate-scale-in animate-stagger-3">
        <ConvertButton onClick={handleConvert} disabled={isConverting} />

        {status && (
          <div
            className={`w-full rounded-xl p-3 animate-bounce-in ${
              status.includes("Error") || status.includes("❌")
                ? "bg-error/10 text-error"
                : status.includes("Successfully") || status.includes("✅")
                ? "bg-success/10 text-success"
                : "bg-surface text-primary"
            }`}
          >
            {isConverting && (
              <div className="w-full h-1 bg-surface-hover rounded-full mb-3 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-brand-300 to-brand-500 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            )}

            <div className="flex items-center">
              {isConverting && (
                <svg
                  className="animate-spin flex-shrink-0 mr-2 h-4 w-4"
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
              )}

              <p className="font-medium text-sm">{status}</p>
            </div>

            {status.includes("Converting") && !status.includes("Converted") && (
              <p className="text-xs text-secondary mt-1 ml-6">
                Please wait while processing your image(s)...
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// TODO: Implement components for other tabs

const EditTabContent: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[300px] space-y-4">
      <div className="p-4 rounded-full bg-surface">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12 text-secondary"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
          />
        </svg>
      </div>
      <h3 className="text-xl font-medium text-primary">
        Edit Feature Coming Soon
      </h3>
      <p className="text-secondary text-center text-sm max-w-xs">
        The image editing feature is under development. Check back soon!
      </p>
    </div>
  );
};

const CropTabContent: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[300px] space-y-4">
      <div className="p-4 rounded-full bg-surface">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12 text-secondary"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
          />
        </svg>
      </div>
      <h3 className="text-xl font-medium text-primary">
        Crop Feature Coming Soon
      </h3>
      <p className="text-secondary text-center text-sm max-w-xs">
        The image cropping feature is under development. Check back soon!
      </p>
    </div>
  );
};

const CompressTabContent: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[300px] space-y-4">
      <div className="p-4 rounded-full bg-surface">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12 text-secondary"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </div>
      <h3 className="text-xl font-medium text-primary">
        Compress Feature Coming Soon
      </h3>
      <p className="text-secondary text-center text-sm max-w-xs">
        The image compression feature is under development. Check back soon!
      </p>
    </div>
  );
};

const MetadataTabContent: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[300px] space-y-4">
      <div className="p-4 rounded-full bg-surface">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12 text-secondary"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      </div>
      <h3 className="text-xl font-medium text-primary">
        Metadata Feature Coming Soon
      </h3>
      <p className="text-secondary text-center text-sm max-w-xs">
        The metadata viewing and editing feature is under development. Check
        back soon!
      </p>
    </div>
  );
};

const CompareTabContent: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[300px] space-y-4">
      <div className="p-4 rounded-full bg-surface">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12 text-secondary"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      </div>
      <h3 className="text-xl font-medium text-primary">
        Compare Feature Coming Soon
      </h3>
      <p className="text-secondary text-center text-sm max-w-xs">
        The side-by-side comparison feature is under development. Check back
        soon!
      </p>
    </div>
  );
};

export default TabContent;
