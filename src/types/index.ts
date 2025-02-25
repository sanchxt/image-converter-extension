export type ImageFormat = "png" | "jpg" | "webp" | "avif";

export type ImageSource = "file" | "url";

export interface ConversionOptions {
  format: ImageFormat;
  quality?: number;
}
