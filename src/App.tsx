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

  const { convertAndDownload, isConverting } = useImageConversion({
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
      className={`min-h-screen w-full min-w-[320px] ${theme}`}
      style={{
        background: `linear-gradient(180deg, var(--bg-gradient-1), var(--bg-gradient-2), var(--bg-gradient-3))`,
      }}
    >
      <Header theme={theme} toggleTheme={toggleTheme} />

      <main className="container px-4 pb-4">
        <section className="mb-6">
          <h1 className="text-center text-xl text-primary pt-3 pb-1 font-nunito animate-glow">
            Image Converter
          </h1>

          <div className="relative text-center">
            <h2 className="text-xs italic text-secondary py-2 relative">
              <span className="bg-black/10 right-0 transition-all duration-600 ease-in-out group-hover:right-[-100%] dark:bg-white/10">
                Unlimited Conversions
              </span>
            </h2>
            <h2 className="text-xs italic text-secondary py-2 absolute top-0 left-[-100%] w-full transition-all duration-600 ease-in-out hover:left-0 bg-black/30 dark:bg-white/30">
              For Free
            </h2>
          </div>
        </section>

        <section className="mb-4">
          <ImageSourceSelector
            source={imageSource}
            onSourceChange={handleSourceChange}
          />

          {imageSource === "url" ? (
            <div className="mb-4">
              <label
                htmlFor="image-url"
                className="block text-primary text-base mb-2 transition-all duration-300 hover:tracking-wider hover:underline hover:decoration-primary hover:underline-offset-3 hover:decoration-2"
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
        </section>

        <section className="mb-4">
          <ImageFormatSelector
            selectedFormat={selectedFormat}
            onFormatChange={handleFormatChange}
          />
        </section>

        <section className="flex justify-center mb-4">
          <ConvertButton onClick={handleConvert} disabled={isConverting} />
        </section>

        {status && (
          <p
            id="status"
            className="text-primary font-semibold italic tracking-wider mx-2 my-1"
            role="status"
          >
            {status}
          </p>
        )}
      </main>
    </div>
  );
};

export default App;
