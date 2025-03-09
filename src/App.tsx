import React, { useState } from "react";

import { useTheme } from "./hooks/useTheme";
import { useImageConversion } from "./hooks/useImageConversion";
import { ImageFormat, ImageSource } from "./types";
import { TabId } from "./types/tabs.types";
import Layout from "./components/Layout";
import ImagePreview from "./components/ImagePreview";
import TabContent from "./components/TabContent";

const App: React.FC = () => {
  const [theme, toggleTheme] = useTheme();
  const [activeTab, setActiveTab] = useState<TabId>("convert");

  // image state
  const [imageSource, setImageSource] = useState<ImageSource>("file");
  const [url, setUrl] = useState<string>("");
  const [files, setFiles] = useState<File[]>([]);
  const [selectedFormat, setSelectedFormat] = useState<ImageFormat>("png");
  const [status, setStatus] = useState<string>("");
  const [activeImage, setActiveImage] = useState<File | string | null>(null);

  // conversion hook
  const { convertAndDownload, isConverting, progress } = useImageConversion({
    onStatusChange: setStatus,
  });

  // handlers
  const handleSourceChange = (source: ImageSource) => {
    setImageSource(source);
    setStatus("");

    setActiveImage(null);
  };

  const handleFormatChange = (format: ImageFormat) => {
    setSelectedFormat(format);
  };

  const handleFilesSelected = (selectedFiles: File[]) => {
    setFiles(selectedFiles);
    setStatus("");

    if (selectedFiles.length > 0) {
      setActiveImage(selectedFiles[0]);
    } else {
      setActiveImage(null);
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setUrl(newUrl);
    setStatus("");

    if (newUrl) {
      setActiveImage(newUrl);
    } else {
      setActiveImage(null);
    }
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
    <Layout
      theme={theme}
      toggleTheme={toggleTheme}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
    >
      <div className="space-y-4">
        <div className="card p-4 animate-scale-in">
          <h2 className="text-primary font-medium text-sm mb-2">
            Image Preview
          </h2>
          <ImagePreview imageSource={activeImage} />
        </div>

        <TabContent
          activeTab={activeTab}
          imageSource={imageSource}
          url={url}
          handleUrlChange={handleUrlChange}
          handleSourceChange={handleSourceChange}
          files={files}
          onFilesSelected={handleFilesSelected}
          selectedFormat={selectedFormat}
          handleFormatChange={handleFormatChange}
          handleConvert={handleConvert}
          isConverting={isConverting}
          status={status}
          progress={progress}
        />
      </div>
    </Layout>
  );
};

export default App;
