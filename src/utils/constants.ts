import { ImageFormat } from "../types";

export const IMAGE_FORMATS: { id: ImageFormat; label: string }[] = [
  { id: "png", label: "PNG" },
  { id: "jpg", label: "JPG" },
  { id: "webp", label: "WEBP" },
  { id: "avif", label: "AVIF" },
];

export const MIME_TYPES: Record<ImageFormat, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  webp: "image/webp",
  avif: "image/avif",
};
