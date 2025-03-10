import { useEffect, useState } from "react";
import {
  applyImageAdjustments,
  downloadEditedImage,
  ImageAdjustments,
} from "../utils/imageEditing";
import { DEFAULT_ADJUSTMENTS } from "../utils/constants";

interface Props {
  onStatusChange: (status: string) => void;
}

interface UseImageEditReturn {
  adjustments: ImageAdjustments;
  setAdjustment: (property: keyof ImageAdjustments, value: number) => void;
  resetAdjustment: (property: keyof ImageAdjustments) => void;
  resetAllAdjustments: () => void;
  previewUrl: string | null;
  generatePreview: (imageSource: File | string) => Promise<void>;
  applyEdits: (imageSource: File | string, format?: string) => Promise<void>;
  isProcessing: boolean;
  hasChanges: boolean;
}

export const useImageEdit = ({ onStatusChange }: Props): UseImageEditReturn => {
  const [adjustments, setAdjustments] = useState<ImageAdjustments>({
    ...DEFAULT_ADJUSTMENTS,
  });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [originalPreviewUrl, setOriginalPreviewUrl] = useState<string | null>(
    null,
  );

  // cleanup preview URL on mount
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      if (originalPreviewUrl) URL.revokeObjectURL(originalPreviewUrl);
    };
  }, [previewUrl, originalPreviewUrl]);

  // set adjustment value
  const setAdjustment = (property: keyof ImageAdjustments, value: number) => {
    setAdjustments(prev => ({
      ...prev,
      [property]: value,
    }));
  };

  // reset a specific adjustment
  const resetAdjustment = (property: keyof ImageAdjustments) => {
    setAdjustments(prev => ({
      ...prev,
      [property]: DEFAULT_ADJUSTMENTS[property],
    }));
  };

  // reset all adjustments
  const resetAllAdjustments = () => {
    setAdjustments({ ...DEFAULT_ADJUSTMENTS });
  };

  // check if any value's different from default
  const hasChanges = Object.entries(adjustments).some(
    ([key, value]) =>
      value !== DEFAULT_ADJUSTMENTS[key as keyof ImageAdjustments],
  );

  // generate preview
  const generatePreview = async (imageSource: File | string) => {
    if (!imageSource) {
      setPreviewUrl(null);
      return;
    }

    setIsProcessing(true);
    onStatusChange("Generating preview...");

    try {
      let sourceToUse = imageSource;

      // keep reference to original image
      if (typeof imageSource === "string" && !imageSource.startsWith("blob:")) {
        if (originalPreviewUrl !== imageSource) {
          setOriginalPreviewUrl(imageSource);
        }
      } else if (imageSource instanceof File) {
        if (!originalPreviewUrl) {
          const fileUrl = URL.createObjectURL(imageSource);
          setOriginalPreviewUrl(fileUrl);
          sourceToUse = fileUrl;
        } else {
          sourceToUse = originalPreviewUrl;
        }
      }

      // apply adjustments and get result as blob
      const adjustedBlob = await applyImageAdjustments(
        sourceToUse,
        adjustments,
      );

      // revoke previous preview URL if exists and it's not the original
      if (previewUrl && previewUrl !== originalPreviewUrl) {
        URL.revokeObjectURL(previewUrl);
      }

      // create new URL for preview
      const newPreviewUrl = URL.createObjectURL(adjustedBlob);
      setPreviewUrl(newPreviewUrl);
      onStatusChange("Preview updated");
    } catch (error) {
      console.error("Error generating preview:", error);
      onStatusChange(
        `Error: ${
          error instanceof Error ? error.message : "Failed to generate preview"
        }`,
      );
    } finally {
      setIsProcessing(false);
    }
  };

  // apply edits & download
  const applyEdits = async (
    imageSource: File | string,
    format: string = "png",
  ) => {
    if (!imageSource) {
      onStatusChange("No image to edit");
      return;
    }

    setIsProcessing(true);
    onStatusChange("Applying edits...");

    try {
      const adjustedBlob = await applyImageAdjustments(
        imageSource,
        adjustments,
        format,
      );
      downloadEditedImage(adjustedBlob, imageSource);
      onStatusChange("Image edited and downloaded successfully!");
    } catch (error) {
      console.error("Error applying edits:", error);
      onStatusChange(
        `❌ Error: ${
          error instanceof Error ? error.message : "Failed to apply edits"
        }`,
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    adjustments,
    setAdjustment,
    resetAdjustment,
    resetAllAdjustments,
    previewUrl,
    generatePreview,
    applyEdits,
    isProcessing,
    hasChanges,
  };
};
