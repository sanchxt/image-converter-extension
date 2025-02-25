import { useState } from "react";
import { ImageFormat } from "../types";
import {
  convertImage,
  downloadBlob,
  getFilenameWithoutExtension,
} from "../utils/imageConversion";

interface UseImageConversionProps {
  onStatusChange: (status: string) => void;
}

interface ConversionResult {
  success: boolean;
  message: string;
  filename?: string;
}

export const useImageConversion = ({
  onStatusChange,
}: UseImageConversionProps) => {
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);

  const convertAndDownloadSingle = async (
    imageSource: File | string,
    format: ImageFormat,
  ): Promise<ConversionResult> => {
    try {
      const blob = await convertImage(imageSource, { format });

      let filename = "ImageFX";
      if (imageSource instanceof File) {
        filename = getFilenameWithoutExtension(imageSource.name);
      }

      downloadBlob(blob, filename, format);

      return {
        success: true,
        message: "Conversion successful!",
        filename:
          imageSource instanceof File ? imageSource.name : "image from URL",
      };
    } catch (error) {
      console.error("Error during conversion:", error);
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "Unknown error occurred",
        filename:
          imageSource instanceof File ? imageSource.name : "image from URL",
      };
    }
  };

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const convertAndDownload = async (
    imageSource: File | string | File[],
    format: ImageFormat,
  ): Promise<void> => {
    setIsConverting(true);
    setProgress(0);
    onStatusChange("Preparing conversion...");

    await delay(300);

    try {
      if (Array.isArray(imageSource)) {
        if (imageSource.length === 0) {
          onStatusChange("Please select at least one image file");
          setIsConverting(false);
          return;
        }

        let successCount = 0;
        let errorCount = 0;
        const totalFiles = imageSource.length;

        for (let i = 0; i < totalFiles; i++) {
          const file = imageSource[i];
          const progressPercent = Math.round((i / totalFiles) * 100);
          setProgress(progressPercent);

          const fileNumber = i + 1;
          onStatusChange(
            `Converting (${fileNumber}/${totalFiles}): ${file.name}`,
          );

          if (totalFiles > 5 && file.size < 100000) {
            await delay(100);
          }

          const result = await convertAndDownloadSingle(file, format);

          if (result.success) {
            successCount++;
          } else {
            errorCount++;
          }
        }

        setProgress(100);

        if (errorCount === 0) {
          onStatusChange(
            `✅ Successfully converted ${successCount} image${
              successCount !== 1 ? "s" : ""
            }!`,
          );
        } else {
          onStatusChange(
            `⚠️ Converted ${successCount} image${
              successCount !== 1 ? "s" : ""
            }, with ${errorCount} error${errorCount !== 1 ? "s" : ""}`,
          );
        }
      } else {
        onStatusChange(
          `Converting ${
            typeof imageSource === "string"
              ? "image from URL"
              : imageSource.name
          }...`,
        );
        setProgress(50);

        const result = await convertAndDownloadSingle(imageSource, format);
        setProgress(100);

        if (result.success) {
          onStatusChange(`✅ Successfully converted ${result.filename}!`);
        } else {
          onStatusChange(`❌ Error: ${result.message}`);
        }
      }
    } catch (error) {
      console.error("Error in conversion process:", error);
      onStatusChange(
        `❌ Error: ${
          error instanceof Error ? error.message : "Unknown error occurred"
        }`,
      );
    } finally {
      setIsConverting(false);
    }
  };

  return {
    convertAndDownload,
    isConverting,
    progress,
  };
};
