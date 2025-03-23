import { useEffect, useState } from "react";

// hooks
import { useTheme } from "./hooks/useTheme";
import { useImageEdit } from "./hooks/useImageEdit";
import { useImageConversion } from "./hooks/useImageConversion";

// types
import { TabId } from "./types/tabs.types";
import { ImageFormat, ImageSource } from "./types";

// components
import Layout from "./components/Layout";
import TabContent from "./components/TabContent";
import ImagePreview from "./components/ImagePreview";

const App = () => {
  const [theme, toggleTheme] = useTheme();
  const [activeTab, setActiveTab] = useState<TabId>("convert");

  // shared image state
  const [imageSource, setImageSource] = useState<ImageSource>("file");
  const [url, setUrl] = useState<string>("");
  const [files, setFiles] = useState<File[]>([]);
  const [selectedFormat, setSelectedFormat] = useState<ImageFormat>("png");
  const [status, setStatus] = useState<string>("");
  const [activeImage, setActiveImage] = useState<File | string | null>(null);
  const [progress, setProgress] = useState<number>(0);

  // conversion hook
  const { convertAndDownload, isConverting } = useImageConversion({
    onStatusChange: setStatus,
  });

  // image editing hook
  const {
    adjustments,
    setAdjustment,
    resetAdjustment,
    resetAllAdjustments,
    previewUrl,
    generatePreview,
    applyEdits,
    isProcessing,
    hasChanges,
  } = useImageEdit({
    onStatusChange: setStatus,
  });

  // update progress for both operations
  useEffect(() => {
    if (isConverting || isProcessing) {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 95) {
            clearInterval(interval);
            return prev;
          }
          return prev + 5;
        });
      }, 200);

      return () => clearInterval(interval);
    } else setProgress(0);
  }, [isConverting, isProcessing]);

  // generate preview when activeImage / adjustments change & we're in edit tab
  useEffect(() => {
    if (activeTab === "edit" && activeImage) generatePreview(activeImage);
  }, [activeTab, activeImage, generatePreview]);

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

    if (selectedFiles.length > 0) setActiveImage(selectedFiles[0]);
    else setActiveImage(null);
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setUrl(newUrl);
    setStatus("");

    if (newUrl) setActiveImage(newUrl);
    else setActiveImage(null);
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

  const handleApplyEdits = async () => {
    if (!activeImage) {
      setStatus("No image to edit");
      return;
    }
    await applyEdits(activeImage, selectedFormat);
  };

  // reset adjustments when tab changes
  useEffect(() => {
    if (activeTab !== "edit") resetAllAdjustments();
  }, [activeTab]);

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
          <ImagePreview
            imageSource={
              activeTab === "edit" && previewUrl ? previewUrl : activeImage
            }
            key={
              activeTab === "edit" && previewUrl
                ? previewUrl
                : activeImage
                ? "active-image"
                : "no-image"
            }
            isProcessing={isProcessing}
          />
        </div>

        <TabContent
          activeTab={activeTab}
          // convert tab props
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
          // edit tab props
          activeImage={activeImage}
          adjustments={adjustments}
          setAdjustment={setAdjustment}
          resetAdjustment={resetAdjustment}
          resetAllAdjustments={resetAllAdjustments}
          applyEdits={handleApplyEdits}
          isProcessing={isProcessing}
          hasChanges={hasChanges}
        />
      </div>
    </Layout>
  );
};

export default App;
