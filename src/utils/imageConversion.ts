import heic2any from "heic2any";

import { ConversionOptions, ImageFormat } from "../types";
import { MIME_TYPES } from "./constants";

export const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => resolve(img);

    img.onerror = e => {
      console.error("Image failed to load:", src, e);
      reject(new Error("Failed to load image"));
    };

    // handle cross-origin images
    if (src.startsWith("http") && !src.startsWith(window.location.origin)) {
      img.crossOrigin = "anonymous";
    }

    img.src = src;
  });
};

export const isHeicFile = (file: File): boolean => {
  return (
    file.type === "image/heic" || file.name.toLowerCase().endsWith(".heic")
  );
};

export const convertHeicToBlob = async (
  file: File,
  format: ImageFormat,
): Promise<Blob> => {
  try {
    const targetType = format === "jpg" ? "image/jpeg" : "image/png";
    const conversionResult = await heic2any({
      blob: file,
      toType: targetType,
      quality: 0.9,
    });

    if (
      (format === "jpg" && targetType === "image/jpeg") ||
      (format === "png" && targetType === "image/png")
    ) {
      return conversionResult instanceof Blob
        ? conversionResult
        : conversionResult[0];
    }

    const blob =
      conversionResult instanceof Blob ? conversionResult : conversionResult[0];
    const img = await loadImage(URL.createObjectURL(blob));

    return await convertImageToFormat(img, format);
  } catch (error) {
    console.error("Error converting HEIC:", error);
    throw new Error(
      `Failed to convert HEIC: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    );
  }
};

export const convertImageToFormat = async (
  img: HTMLImageElement,
  format: ImageFormat,
  quality: number = 0.9,
): Promise<Blob> => {
  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext("2d");

  if (!ctx) throw new Error("Unable to get canvas context");

  ctx.drawImage(img, 0, 0);
  const mimeType = MIME_TYPES[format];

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      blob => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error("Failed to convert image"));
        }
      },
      mimeType,
      quality,
    );
  });
};

export const convertImage = async (
  imageSource: File | string,
  options: ConversionOptions,
): Promise<Blob> => {
  try {
    if (imageSource instanceof File && isHeicFile(imageSource)) {
      if (options.format === "heic") return imageSource;

      return await convertHeicToBlob(imageSource, options.format);
    }

    if (options.format === "heic")
      throw new Error(
        "Converting to HEIC format is not supported in browsers. Please use a different format.",
      );

    let img: HTMLImageElement;

    if (typeof imageSource === "string") {
      // url src
      const response = await fetch(imageSource);
      const blob = await response.blob();

      // check if the blob is HEIC
      if (blob.type === "image/heic") {
        const convertedBlob = await convertHeicToBlob(
          new File([blob], "image.heic", { type: "image/heic" }),
          options.format,
        );
        return convertedBlob;
      }

      img = await loadImage(URL.createObjectURL(blob));
    } else img = await loadImage(URL.createObjectURL(imageSource));

    return await convertImageToFormat(img, options.format, options.quality);
  } catch (error) {
    console.error("Error converting image:", error);
    throw error;
  }
};

export const downloadBlob = (
  blob: Blob,
  filename: string,
  format: ImageFormat,
): void => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename}.${format}`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const getFilenameWithoutExtension = (filename: string): string => {
  return filename.replace(/\.[^/.]+$/, "");
};
