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
}

export const useImageConversion = ({
  onStatusChange,
}: UseImageConversionProps) => {
  const [isConverting, setIsConverting] = useState(false);

  const convertAndDownloadSingle = async (
    imageSource: File | string,
    format: ImageFormat
  ): Promise<ConversionResult> => {
    try {
      const blob = await convertImage(imageSource, { format });

      let filename = "ImageConverter";
      if (imageSource instanceof File) {
        filename = getFilenameWithoutExtension(imageSource.name);
      }

      downloadBlob(blob, filename, format);

      return { success: true, message: "Conversion successful!" };
    } catch (error) {
      console.error("Error during conversion:", error);
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  };

  const convertAndDownload = async (
    imageSource: File | string | File[],
    format: ImageFormat
  ): Promise<void> => {
    setIsConverting(true);
    onStatusChange("Converting...");

    try {
      if (Array.isArray(imageSource)) {
        if (imageSource.length === 0) {
          onStatusChange("Please select at least one image file");
          setIsConverting(false);
          return;
        }

        let successCount = 0;
        let errorCount = 0;

        for (let i = 0; i < imageSource.length; i++) {
          onStatusChange(`Converting ${i + 1}/${imageSource.length}...`);
          const result = await convertAndDownloadSingle(imageSource[i], format);
          if (result.success) {
            successCount++;
          } else {
            errorCount++;
          }
        }

        if (errorCount === 0) {
          onStatusChange(
            `Successfully converted ${successCount} image${
              successCount !== 1 ? "s" : ""
            }!`
          );
        } else {
          onStatusChange(
            `Converted ${successCount} image${
              successCount !== 1 ? "s" : ""
            }, with ${errorCount} error${errorCount !== 1 ? "s" : ""}`
          );
        }
      } else {
        const result = await convertAndDownloadSingle(imageSource, format);
        onStatusChange(result.message);
      }
    } catch (error) {
      console.error("Error in conversion process:", error);
      onStatusChange(
        `Error: ${
          error instanceof Error ? error.message : "Unknown error occurred"
        }`
      );
    } finally {
      setIsConverting(false);
    }
  };

  return {
    convertAndDownload,
    isConverting,
  };
};
