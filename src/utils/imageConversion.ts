import { ConversionOptions, ImageFormat } from "../types";
import { MIME_TYPES } from "./constants";

export const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};

export const convertImage = async (
  imageSource: File | string,
  options: ConversionOptions
): Promise<Blob> => {
  try {
    let img: HTMLImageElement;

    if (typeof imageSource === "string") {
      // url src
      const response = await fetch(imageSource);
      const blob = await response.blob();
      img = await loadImage(URL.createObjectURL(blob));
    } else {
      // file src
      img = await loadImage(URL.createObjectURL(imageSource));
    }

    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error("Unable to get canvas context");
    }

    ctx.drawImage(img, 0, 0);

    const mimeType = MIME_TYPES[options.format];

    return new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error("Failed to convert image"));
          }
        },
        mimeType,
        options.quality
      );
    });
  } catch (error) {
    console.error("Error converting image:", error);
    throw error;
  }
};

export const downloadBlob = (
  blob: Blob,
  filename: string,
  format: ImageFormat
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
