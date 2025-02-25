import React, { useState } from "react";

import Header from "./components/Header";
import ImageSourceSelector from "./components/ImageSourceSelector";
import ImageDropzone from "./components/ImageDropzone";
import ImageFormatSelector from "./components/ImageFormatSelector";
import ConvertButton from "./components/ConvertButton";

import { useTheme } from "./hooks/useTheme";
import { useImageConversion } from "./hooks/useImageConversion";
import { ImageFormat, ImageSource } from "./types";

const App: React.FC = () => {
  const [theme, toggleTheme] = useTheme();

  const [imageSource, setImageSource] = useState<ImageSource>("file");
  const [url, setUrl] = useState<string>("");
  const [files, setFiles] = useState<File[]>([]);
  const [selectedFormat, setSelectedFormat] = useState<ImageFormat>("png");
  const [status, setStatus] = useState<string>("");

  const { convertAndDownload, isConverting, progress } = useImageConversion({
    onStatusChange: setStatus,
  });

  const handleSourceChange = (source: ImageSource) => {
    setImageSource(source);
    setStatus("");
  };

  const handleFormatChange = (format: ImageFormat) => {
    setSelectedFormat(format);
  };

  const handleFilesSelected = (selectedFiles: File[]) => {
    setFiles(selectedFiles);
    setStatus("");
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
    setStatus("");
  };

  const handleConvert = async () => {
    if (imageSource === "url") {
      if (!url) {
        setStatus("Please enter an image URL");
        return;
      }
      await convertAndDownload(url, selectedFormat);
    } else {
      if (files.length === 0) {
        setStatus("Please select at least one image file");
        return;
      }
      await convertAndDownload(files, selectedFormat);
    }
  };

  return (
    <div
      className={`min-h-screen w-full min-w-[350px] ${theme}`}
      style={{
        background: `linear-gradient(180deg, var(--bg-gradient-1), var(--bg-gradient-2), var(--bg-gradient-3))`,
      }}
    >
      <div className="max-w-md mx-auto pb-6">
        <Header theme={theme} toggleTheme={toggleTheme} />

        <main className="px-4 space-y-5">
          <section className="text-center space-y-2 animate-fade-in">
            <h1
              className="text-2xl font-bold text-primary pt-2 font-nunito animate-glow
                          bg-gradient-to-r from-brand-300 to-brand-500 bg-clip-text"
            >
              Image Converter
            </h1>

            <div className="relative overflow-hidden h-5 group">
              <p className="text-xs text-secondary italic absolute w-full transition-all duration-500 transform translate-y-0 group-hover:translate-y-[-200%]">
                Unlimited Conversions
              </p>
              <p className="text-xs text-brand-300 italic absolute w-full transition-all duration-500 transform translate-y-[200%] group-hover:translate-y-0">
                For Free
              </p>
            </div>
          </section>

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
              <ImageDropzone onFilesSelected={handleFilesSelected} />
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

                {status.includes("Converting") &&
                  !status.includes("Converted") && (
                    <p className="text-xs text-secondary mt-1 ml-6">
                      Please wait while processing your image(s)...
                    </p>
                  )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
