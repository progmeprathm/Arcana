/**
 * Client-side image processing utility for parchment notes and handwritten grimoires.
 * Enhances ink contrast, applies grayscale normalization, and prepares images for OCR.
 */

export interface PreprocessingOptions {
  contrastBoost?: number; // 1.0 = normal, 1.5 = high contrast
  brightnessOffset?: number; // -50 to 50
  applyBinarization?: boolean; // black & white thresholding
  maxDimension?: number;
}

export interface ProcessedImageResult {
  previewUrl: string;
  blob: Blob;
  width: number;
  height: number;
}

/**
 * Loads an image File into an HTMLImageElement.
 */
export function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error(`Invalid file type: ${file.type}. Expected an image.`));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Failed to decode image data.'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read file from disk.'));
    reader.readAsDataURL(file);
  });
}

/**
 * Applies contrast enhancement and optional binarization to an image using Canvas 2D.
 */
export function preprocessParchmentImage(
  img: HTMLImageElement,
  options: PreprocessingOptions = {}
): Promise<ProcessedImageResult> {
  return new Promise((resolve, reject) => {
    const {
      contrastBoost = 1.35,
      brightnessOffset = 10,
      applyBinarization = false,
      maxDimension = 1800
    } = options;

    // Calculate aspect-ratio preserved downscaled dimensions
    let width = img.naturalWidth || img.width;
    let height = img.naturalHeight || img.height;

    if (width > maxDimension || height > maxDimension) {
      if (width > height) {
        height = Math.round((height * maxDimension) / width);
        width = maxDimension;
      } else {
        width = Math.round((width * maxDimension) / height);
        height = maxDimension;
      }
    }

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      reject(new Error('Canvas 2D context not available.'));
      return;
    }

    // Draw initial image
    ctx.drawImage(img, 0, 0, width, height);

    // Retrieve pixel buffer
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    // Factor for contrast: (259 * (contrast + 255)) / (255 * (259 - contrast))
    const contrastVal = (contrastBoost - 1.0) * 128;
    const factor = (259 * (contrastVal + 255)) / (255 * (259 - contrastVal));

    // Pixel manipulation
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      // Luminance conversion (Rec. 709)
      const gray = 0.2126 * r + 0.7152 * g + 0.0722 * b;

      // Contrast and brightness adjustment
      let adjusted = factor * (gray - 128) + 128 + brightnessOffset;
      adjusted = Math.min(255, Math.max(0, adjusted));

      if (applyBinarization) {
        // High-contrast ink thresholding (Otsu-style dynamic cutoff ~140)
        adjusted = adjusted < 140 ? 0 : 255;
      }

      data[i] = adjusted;     // R
      data[i + 1] = adjusted; // G
      data[i + 2] = adjusted; // B
      // Alpha data[i + 3] remains untouched
    }

    ctx.putImageData(imageData, 0, 0);

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Failed to produce image blob from canvas.'));
          return;
        }
        const previewUrl = URL.createObjectURL(blob);
        resolve({
          previewUrl,
          blob,
          width,
          height
        });
      },
      'image/jpeg',
      0.92
    );
  });
}

