import { ImageFormat } from "../types";
import { Tab } from "../types/tabs.types";

export const IMAGE_FORMATS: { id: ImageFormat; label: string }[] = [
  { id: "png", label: "PNG" },
  { id: "jpg", label: "JPG" },
  { id: "webp", label: "WEBP" },
  { id: "avif", label: "AVIF" },
  { id: "heic", label: "HEIC" },
];

export const MIME_TYPES: Record<ImageFormat, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  webp: "image/webp",
  avif: "image/avif",
  heic: "image/heic",
};

export const ACCEPTED_FILE_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
  "image/avif",
  "image/heic",
  ".heic",
];
