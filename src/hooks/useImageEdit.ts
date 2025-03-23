import { useCallback, useEffect, useRef, useState } from "react";
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
  const [currentImageSource, setCurrentImageSource] = useState<
    File | string | null
  >(null);

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const latestAdjustmentsRef = useRef(adjustments);

  // update ref when adjustments change
  useEffect(() => {
    latestAdjustmentsRef.current = adjustments;
  }, [adjustments]);

  // cleanup URLs on unmount
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // refs for UI updates and preview generation
  const uiDebounceRef = useRef<NodeJS.Timeout | null>(null);
  const previewDebounceRef = useRef<NodeJS.Timeout | null>(null);
  const [debouncedAdjustments, setDebouncedAdjustments] = useState(adjustments);

  const setAdjustment = useCallback(
    (property: keyof ImageAdjustments, value: number) => {
      // update UI value debounce
      if (uiDebounceRef.current) {
        clearTimeout(uiDebounceRef.current);
      }

      uiDebounceRef.current = setTimeout(() => {
        setAdjustments(prev => ({
          ...prev,
          [property]: value,
        }));
      }, 16); // ~1 frame at 60fps

      if (previewDebounceRef.current) {
        clearTimeout(previewDebounceRef.current);
      }

      previewDebounceRef.current = setTimeout(() => {
        setDebouncedAdjustments(prev => ({
          ...prev,
          [property]: value,
        }));
      }, 150); // debounce for preview generation
    },
    [],
  );

  const generatePreview = useCallback(
    async (imageSource: File | string) => {
      if (!imageSource) {
        setPreviewUrl(null);
        return;
      }

      setCurrentImageSource(imageSource);
      setIsProcessing(true);
      onStatusChange("Generating preview...");

      try {
        let sourceUrl: string;

        if (typeof imageSource === "string") {
          // for URLs, use them directly
          sourceUrl = imageSource;
        } else {
          // for files, create object URL
          sourceUrl = URL.createObjectURL(imageSource);
        }

        // apply adjustments
        const adjustedBlob = await applyImageAdjustments(
          sourceUrl,
          adjustments,
        );

        // clean up previous preview URL if it exists
        if (previewUrl && previewUrl.startsWith("blob:")) {
          URL.revokeObjectURL(previewUrl);
        }

        // create new preview URL
        const newPreviewUrl = URL.createObjectURL(adjustedBlob);
        setPreviewUrl(newPreviewUrl);
        onStatusChange("Preview updated");

        // cleanup source URL if it was created from a File
        if (typeof imageSource !== "string") {
          URL.revokeObjectURL(sourceUrl);
        }
      } catch (error) {
        console.error("Error generating preview:", error);
        onStatusChange(
          `Error: ${
            error instanceof Error
              ? error.message
              : "Failed to generate preview"
          }`,
        );
      } finally {
        setIsProcessing(false);
      }
    },
    [adjustments, onStatusChange],
  );

  // trigger preview generation when debounced adjustments change
  useEffect(() => {
    if (currentImageSource) {
      generatePreview(currentImageSource);
    }
  }, [debouncedAdjustments, currentImageSource, generatePreview]);

  const resetAdjustment = useCallback(
    (property: keyof ImageAdjustments) => {
      setAdjustments(prev => ({
        ...prev,
        [property]: DEFAULT_ADJUSTMENTS[property],
      }));

      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = setTimeout(() => {
        if (currentImageSource) generatePreview(currentImageSource);
      }, 50);
    },
    [currentImageSource],
  );

  const resetAllAdjustments = useCallback(() => {
    setAdjustments({ ...DEFAULT_ADJUSTMENTS });

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      if (currentImageSource) generatePreview(currentImageSource);
    }, 50);
  }, [currentImageSource]);

  const hasChanges = Object.entries(adjustments).some(
    ([key, value]) =>
      value !== DEFAULT_ADJUSTMENTS[key as keyof ImageAdjustments],
  );

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
      let sourceUrl: string;

      if (typeof imageSource === "string") {
        sourceUrl = imageSource;
      } else {
        sourceUrl = URL.createObjectURL(imageSource);
      }

      const adjustedBlob = await applyImageAdjustments(
        sourceUrl,
        adjustments,
        format,
      );

      downloadEditedImage(adjustedBlob, imageSource);
      onStatusChange("Image edited and downloaded successfully.");

      // cleanup source URL if it was created from a File
      if (typeof imageSource !== "string") {
        URL.revokeObjectURL(sourceUrl);
      }
    } catch (error) {
      console.error("Error applying edits:", error);
      onStatusChange(
        `Error: ${
          error instanceof Error ? error.message : "Failed to apply edits"
        }`,
      );
    } finally {
      setIsProcessing(false);
    }
  };

  // cleanup all timers on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      if (uiDebounceRef.current) {
        clearTimeout(uiDebounceRef.current);
      }
      if (previewDebounceRef.current) {
        clearTimeout(previewDebounceRef.current);
      }
    };
  }, []);

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
