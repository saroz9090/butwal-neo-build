/**
 * Client-Side Smart Compression + Cloudinary Free Direct Upload Service
 * Automatically compresses large device photos (to ~50-100KB WebP)
 * and uploads to high-speed Cloudinary CDN, with dynamic configuration.
 */

export interface UploadResult {
  url: string;
  originalSize: number; // in bytes
  compressedSize: number; // in bytes
  isBase64Fallback?: boolean;
}

// Cloudinary Configuration (Supports custom overrides via public environment variables)
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "dkz1mrcsn"; 
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "butwal_unsigned";

/**
 * Compresses an image file in the browser using HTML5 Canvas to WebP/JPEG format
 */
export async function compressImage(
  file: File,
  maxWidth = 1600,
  maxHeight = 1600,
  quality = 0.82
): Promise<{ blob: Blob; dataUrl: string; width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate scaling
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Could not get canvas context"));
          return;
        }

        // Draw image smoothly
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, width, height);

        // Try WebP first, fallback to JPEG
        let dataUrl = canvas.toDataURL("image/webp", quality);
        if (!dataUrl.startsWith("data:image/webp")) {
          dataUrl = canvas.toDataURL("image/jpeg", quality);
        }

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve({ blob, dataUrl, width, height });
            } else {
              // Convert dataUrl to blob if toBlob returned null
              const arr = dataUrl.split(",");
              const mime = arr[0].match(/:(.*?);/)?.[1] || "image/jpeg";
              const bstr = atob(arr[1]);
              let n = bstr.length;
              const u8arr = new Uint8Array(n);
              while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
              }
              resolve({
                blob: new Blob([u8arr], { type: mime }),
                dataUrl,
                width,
                height,
              });
            }
          },
          "image/webp",
          quality
        );
      };
      img.onerror = () => reject(new Error("Failed to load image for compression"));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

/**
 * Uploads an image file to Cloudinary Free Storage using Unsigned Upload presets.
 */
export async function uploadImageToFreeCloud(
  file: File,
  onProgress?: (percent: number) => void
): Promise<UploadResult> {
  const originalSize = file.size;

  onProgress?.(20);
  // 1. Client-Side Smart Compression
  const { blob } = await compressImage(file);
  const compressedSize = blob.size;

  onProgress?.(50);

  try {
    // 2. Upload to Cloudinary API
    const formData = new FormData();
    formData.append("file", blob, file.name.replace(/\.[^/.]+$/, "") + ".webp");
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
      method: "POST",
      body: formData,
    });

    onProgress?.(85);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMsg = errorData.error?.message || response.statusText;
      throw new Error(`Cloudinary upload error: ${errorMsg}`);
    }

    const data = await response.json();
    if (data && (data.secure_url || data.url)) {
      onProgress?.(100);
      return {
        url: data.secure_url || data.url,
        originalSize,
        compressedSize,
        isBase64Fallback: false,
      };
    }
    throw new Error("Invalid response from Cloudinary storage");
  } catch (error) {
    console.error("Cloudinary upload failed:", error);
    onProgress?.(100);
    // Suggest setting up custom environment variables if the default preset experiences issues
    throw new Error(
      error instanceof Error 
        ? `${error.message}. Please configure your VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET in the .env configuration.`
        : "Cloudinary upload failed. Please verify your connection or try again later."
    );
  }
}

/**
 * Format bytes to readable string (e.g. 1.2 MB or 45 KB)
 */
export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}
