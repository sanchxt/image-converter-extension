import { DEFAULT_ADJUSTMENTS } from "./constants";
import { getFilenameWithoutExtension, loadImage } from "./imageConversion";

export interface ImageAdjustments {
  brightness: number;
  contrast: number;
  saturation: number;
}

/**
 * Apply adjustments to an image using canvas
 * @param imageSource - Original image source (URL or File)
 * @param adjustments - Image adjustment values
 * @returns Promise with the adjusted image as a Blob
 */
export const applyImageAdjustments = async (
  imageSource: File | string,
  adjustments: ImageAdjustments,
  format: string = "png",
): Promise<Blob> => {
  try {
    let img: HTMLImageElement;

    // Handle different source types
    if (typeof imageSource === "string") {
      // Source is a URL
      try {
        img = await loadImage(imageSource);
      } catch (error) {
        console.error("Failed to load image from URL:", error);
        throw new Error("Could not load image from URL");
      }
    } else {
      // Source is a File
      try {
        const objectUrl = URL.createObjectURL(imageSource);
        try {
          img = await loadImage(objectUrl);
        } finally {
          // Always clean up the object URL after loading or on error
          URL.revokeObjectURL(objectUrl);
        }
      } catch (error) {
        console.error("Failed to load image from file:", error);
        throw new Error("Could not load image from file");
      }
    }

    // Create canvas and apply adjustments
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error("Failed to get canvas context");
    }

    // Draw the original image on the canvas
    ctx.drawImage(img, 0, 0);

    // Check if we need to apply adjustments
    const needsAdjustment =
      adjustments.brightness !== DEFAULT_ADJUSTMENTS.brightness ||
      adjustments.contrast !== DEFAULT_ADJUSTMENTS.contrast ||
      adjustments.saturation !== DEFAULT_ADJUSTMENTS.saturation;

    if (needsAdjustment) {
      // Get image data
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Calculate adjustment values
      const brightness = adjustments.brightness / 100;
      const contrast = adjustments.contrast / 100;
      const saturation = adjustments.saturation / 100;

      // Apply pixel-by-pixel adjustments
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        const [h, s, l] = rgbToHsl(r, g, b);

        // Apply saturation
        const newS = clamp(s * saturation, 0, 1);

        // Apply brightness
        let newL = l * brightness;

        // Apply contrast (centered at 0.5)
        newL = (newL - 0.5) * contrast + 0.5;
        newL = clamp(newL, 0, 1);

        const [newR, newG, newB] = hslToRgb(h, newS, newL);

        // Update pixel data
        data[i] = newR;
        data[i + 1] = newG;
        data[i + 2] = newB;
      }

      // Put modified data back to canvas
      ctx.putImageData(imageData, 0, 0);
    }

    // Canvas to blob
    return new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        blob => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error("Failed to create image blob"));
          }
        },
        `image/${format}`,
        0.9,
      );
    });
  } catch (error) {
    console.error("Error in applyImageAdjustments:", error);
    throw error;
  }
};

/**
 * download edited image
 */
export const downloadEditedImage = (
  blob: Blob,
  originalSrc: File | string,
): void => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;

  // file name
  let filename = "edited-image";
  if (originalSrc instanceof File) {
    filename = `${getFilenameWithoutExtension(originalSrc.name)}-edited`;
  }

  a.download = `${filename}.png`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

/**
 * Utility functions for color conversions
 */

// clamp value between min and max
const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

// RGB to HSL
const rgbToHsl = (
  r: number,
  g: number,
  b: number,
): [number, number, number] => {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }

    h /= 6;
  }

  return [h, s, l];
};

// helper for HSL to RGB conversion
const hue2rgb = (p: number, q: number, t: number): number => {
  if (t < 0) t += 1;
  if (t > 1) t -= 1;
  if (t < 1 / 6) return p + (q - p) * 6 * t;
  if (t < 1 / 2) return q;
  if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
  return p;
};

// HSL to RGB
const hslToRgb = (
  h: number,
  s: number,
  l: number,
): [number, number, number] => {
  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
};
