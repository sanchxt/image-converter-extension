import { ImageSource } from "../types";
import { DEFAULT_ADJUSTMENTS } from "../utils/constants";
import { ImageAdjustments } from "../utils/imageEditing";
import AdjustmentSlider from "./AdjustmentSlider";
import ImageDropzone from "./ImageDropzone";
import ImageSourceSelector from "./ImageSourceSelector";

interface EditTabContentProps {
  imageSource: File | string | null;
  adjustments: ImageAdjustments;
  setAdjustment: (property: keyof ImageAdjustments, value: number) => void;
  resetAdjustment: (property: keyof ImageAdjustments) => void;
  resetAllAdjustments: () => void;
  applyEdits: () => void;
  isProcessing: boolean;
  hasChanges: boolean;
  status: string;
  progress: number;
  // image input props
  inputSource: ImageSource;
  url: string;
  handleUrlChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSourceChange: (source: ImageSource) => void;
  onFilesSelected: (files: File[]) => void;
}

const EditTabContent = ({
  imageSource,
  adjustments,
  setAdjustment,
  resetAdjustment,
  resetAllAdjustments,
  applyEdits,
  isProcessing,
  hasChanges,
  status,
  progress,
  // image input props
  inputSource,
  url,
  handleUrlChange,
  handleSourceChange,
  onFilesSelected,
}: EditTabContentProps) => {
  const hasImage = Boolean(imageSource);

  return (
    <div className="space-y-4 animate-scale-in">
      {!hasImage && (
        <div className="card p-5 space-y-5 animate-scale-in">
          <ImageSourceSelector
            source={inputSource}
            onSourceChange={handleSourceChange}
          />

          {inputSource === "url" ? (
            <div className="space-y-2 animate-fade-in">
              <label
                htmlFor="image-url-edit"
                className="block text-primary font-medium text-sm"
              >
                Image URL
              </label>
              <input
                type="text"
                id="image-url-edit"
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
      )}

      <div className="card p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-primary font-medium text-sm">
            Image Adjustments
          </h2>
          <button
            onClick={resetAllAdjustments}
            disabled={!hasChanges || isProcessing || !hasImage}
            className={`text-xs text-primary px-3 py-1.5 rounded-lg transition-all duration-300 ${
              hasChanges && !isProcessing && hasImage
                ? "bg-surface hover:bg-surface-hover text-primary"
                : "bg-surface/50 text-secondary/50 cursor-not-allowed"
            }`}
          >
            Reset All
          </button>
        </div>

        <div className="space-y-5">
          <AdjustmentSlider
            label="Brightness"
            value={adjustments.brightness}
            defaultValue={DEFAULT_ADJUSTMENTS.brightness}
            min={0}
            max={200}
            step={1}
            onChange={value => setAdjustment("brightness", value)}
            onReset={() => resetAdjustment("brightness")}
          />

          <AdjustmentSlider
            label="Contrast"
            value={adjustments.contrast}
            defaultValue={DEFAULT_ADJUSTMENTS.contrast}
            min={0}
            max={200}
            step={1}
            onChange={value => setAdjustment("contrast", value)}
            onReset={() => resetAdjustment("contrast")}
          />

          <AdjustmentSlider
            label="Saturation"
            value={adjustments.saturation}
            defaultValue={DEFAULT_ADJUSTMENTS.saturation}
            min={0}
            max={200}
            step={1}
            onChange={value => setAdjustment("saturation", value)}
            onReset={() => resetAdjustment("saturation")}
          />
        </div>
      </div>

      <div className="flex flex-col items-center space-y-3">
        <button
          onClick={applyEdits}
          disabled={isProcessing || !hasImage || !hasChanges}
          className={`w-full flex items-center justify-center space-x-2 py-3 px-6 rounded-xl font-medium text-white shadow-elevation-1 transition-all duration-300 ${
            !isProcessing && hasImage && hasChanges
              ? "bg-gradient-to-r from-brand-400 to-brand-500 hover:shadow-elevation-2 active:from-brand-500 active:to-brand-600"
              : "bg-brand-400/50 cursor-not-allowed"
          }`}
        >
          {isProcessing ? (
            <svg
              className="animate-spin h-5 w-5"
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
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
              />
            </svg>
          )}
          <span>{isProcessing ? "Processing..." : "Apply & Download"}</span>
        </button>

        {!hasImage && (
          <p className="text-secondary text-sm">
            Please select an image to start editing
          </p>
        )}

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
            {isProcessing && (
              <div className="w-full h-1 bg-surface-hover rounded-full mb-3 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-brand-300 to-brand-500 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            )}

            <div className="flex items-center">
              {isProcessing && (
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
          </div>
        )}
      </div>
    </div>
  );
};

export default EditTabContent;
