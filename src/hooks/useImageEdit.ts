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
  const [originalPreviewUrl, setOriginalPreviewUrl] = useState<string | null>(
    null,
  );
  const [currentImageSource, setCurrentImageSource] = useState<
    File | string | null
  >(null);

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const latestAdjustmentsRef = useRef(adjustments);

  useEffect(() => {
    latestAdjustmentsRef.current = adjustments;
  }, [adjustments]);

  // cleanup preview URL on mount
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:"))
        URL.revokeObjectURL(previewUrl);
      if (originalPreviewUrl && originalPreviewUrl.startsWith("blob:"))
        URL.revokeObjectURL(originalPreviewUrl);
    };
  }, [previewUrl, originalPreviewUrl]);

  // set adjustment value
  const setAdjustment = useCallback(
    (property: keyof ImageAdjustments, value: number) => {
      setAdjustments(prev => ({
        ...prev,
        [property]: value,
      }));

      // debounce rapid changes (avoid too many preview generations)
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = setTimeout(() => {
        if (currentImageSource) generatePreview(currentImageSource);
      }, 100);
    },
    [currentImageSource],
  );

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // reset a specific adjustment
  const resetAdjustment = useCallback(
    (property: keyof ImageAdjustments) => {
      setAdjustments(prev => ({
        ...prev,
        [property]: DEFAULT_ADJUSTMENTS[property],
      }));

      // regenerate preview after reset
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = setTimeout(() => {
        if (currentImageSource) generatePreview(currentImageSource);
      }, 50);
    },
    [currentImageSource],
  );

  // reset all adjustments
  const resetAllAdjustments = useCallback(() => {
    setAdjustments({ ...DEFAULT_ADJUSTMENTS });

    // regenerate preview after reset
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      if (currentImageSource) generatePreview(currentImageSource);
    }, 50);
  }, [currentImageSource]);

  // check if any value's different from default
  const hasChanges = Object.entries(adjustments).some(
    ([key, value]) =>
      value !== DEFAULT_ADJUSTMENTS[key as keyof ImageAdjustments],
  );

  // generate preview
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
        let sourceToUse = imageSource;

        // keep reference to original image
        if (
          typeof imageSource === "string" &&
          !imageSource.startsWith("blob:")
        ) {
          if (originalPreviewUrl !== imageSource) {
            setOriginalPreviewUrl(imageSource);
          }
        } else if (imageSource instanceof File) {
          try {
            // only create a new object URL if one doesn't exist
            if (!originalPreviewUrl) {
              const fileUrl = URL.createObjectURL(imageSource);
              setOriginalPreviewUrl(fileUrl);
              sourceToUse = fileUrl;
            } else {
              sourceToUse = originalPreviewUrl;
            }
          } catch (err) {
            throw new Error("Could not create preview from file");
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

        //   verify blob url works before setting it
        await testImageUrl(newPreviewUrl);

        setPreviewUrl(newPreviewUrl);
        onStatusChange("Preview updated");
      } catch (error) {
        console.error("Error generating preview:", error);

        // if we failed but have an original image...show that
        if (originalPreviewUrl) {
          setPreviewUrl(originalPreviewUrl);
          onStatusChange("Using original image (adjustment failed)");
        } else {
          onStatusChange(
            `Error: ${
              error instanceof Error
                ? error.message
                : "Failed to generate preview"
            }`,
          );
        }
      } finally {
        setIsProcessing(false);
      }
    },
    [adjustments, originalPreviewUrl, previewUrl],
  );

  // helper function to test if an image URL loads correctly
  const testImageUrl = (url: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        console.log("Image loaded successfully:", url);
        resolve();
      };
      img.onerror = e => {
        console.error("Image failed to load:", url, e);
        reject(new Error(`Failed to load image from URL: ${url}`));
      };
      img.src = url;
    });
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
      // use original source if available, otherwise use the provided source
      const sourceToUse = originalPreviewUrl || imageSource;

      const adjustedBlob = await applyImageAdjustments(
        sourceToUse,
        adjustments,
        format,
      );

      downloadEditedImage(adjustedBlob, imageSource);
      onStatusChange("Image edited and downloaded successfully.");
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
