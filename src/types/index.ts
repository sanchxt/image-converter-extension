export type ImageSource = "file" | "url";

export type ImageFormat = "png" | "jpg" | "webp" | "avif" | "heic";

export interface ConversionOptions {
  format: ImageFormat;
  quality?: number;
}

export interface ConversionResult {
  success: boolean;
  message: string;
  filename: string;
}

export interface UseImageConversionProps {
  onStatusChange: (status: string) => void;
}

export type ThemeType = "dark" | "light";
