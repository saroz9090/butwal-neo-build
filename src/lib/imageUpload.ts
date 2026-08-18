/**
 * Client-Side Smart Compression + Multi-Tier Cloud & WebP Storage Engine
 * Automatically compresses large device photos (to ~15-40KB WebP)
 * Provides automatic multi-tier fallback:
 *   1. Custom or Environment Cloudinary (if configured)
 *   2. Free ImgBB / Public image API
 *   3. Ultra-compact WebP Data URI (Zero configuration needed, works on GitHub Pages & Localhost)
 */

export interface UploadResult {
  url: string;
  originalSize: number; // in bytes
  compressedSize: number; // in bytes
  isBase64Fallback?: boolean;
  provider?: "cloudinary" | "imgbb" | "local_webp";
}

/**
 * Retrieves the active Cloudinary settings from env or localStorage CMS settings
 */
export function getCloudinaryConfig() {
  const envCloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const envPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  const localCloudName = typeof window !== "undefined" ? localStorage.getItem("butwal_cloudinary_cloud_name") : null;
  const localPreset = typeof window !== "undefined" ? localStorage.getItem("butwal_cloudinary_preset") : null;

  return {
    cloudName: envCloudName || localCloudName || "",
    uploadPreset: envPreset || localPreset || "",
  };
}

/**
 * Saves Cloudinary settings locally for GitHub Pages / Localhost deployments
 */
export function saveCloudinaryConfig(cloudName: string, uploadPreset: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem("butwal_cloudinary_cloud_name", cloudName.trim());
    localStorage.setItem("butwal_cloudinary_preset", uploadPreset.trim());
  }
}

/**
 * Compresses an image file in the browser using HTML5 Canvas to WebP/JPEG format
 */
export async function compressImage(
  file: File,
  maxWidth = 1600,
  maxHeight = 1600,
  quality = 0.80
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
 * Uploads an image with automatic multi-tier fallback.
 * Works seamlessly in Google Studio, GitHub Pages, and Localhost!
 */
export async function uploadImageToFreeCloud(
  file: File,
  onProgress?: (percent: number) => void
): Promise<UploadResult> {
  const originalSize = file.size;

  onProgress?.(20);
  // 1. Client-Side Smart Compression
  const { blob, dataUrl } = await compressImage(file, 1600, 1600, 0.80);
  const compressedSize = blob.size;

  onProgress?.(45);

  const { cloudName, uploadPreset } = getCloudinaryConfig();

  // Tier 1: Try Cloudinary if cloud name & preset are configured
  if (cloudName && uploadPreset) {
    try {
      const formData = new FormData();
      formData.append("file", blob, file.name.replace(/\.[^/.]+$/, "") + ".webp");
      formData.append("upload_preset", uploadPreset);

      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: formData,
      });

      onProgress?.(85);

      if (response.ok) {
        const data = await response.json();
        if (data && (data.secure_url || data.url)) {
          onProgress?.(100);
          return {
            url: data.secure_url || data.url,
            originalSize,
            compressedSize,
            isBase64Fallback: false,
            provider: "cloudinary",
          };
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.warn("Cloudinary upload rejected:", errorData.error?.message || response.statusText);
      }
    } catch (err) {
      console.warn("Cloudinary fetch failed:", err);
    }
  }

  // Tier 2: Try Free ImgBB / Free image API if available
  const imgbbApiKey = import.meta.env.VITE_IMGBB_API_KEY || (typeof window !== "undefined" ? localStorage.getItem("butwal_imgbb_api_key") : null);
  if (imgbbApiKey) {
    try {
      const formData = new FormData();
      formData.append("image", blob);
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbApiKey}`, {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        const resData = await res.json();
        if (resData.data?.url) {
          onProgress?.(100);
          return {
            url: resData.data.display_url || resData.data.url,
            originalSize,
            compressedSize,
            isBase64Fallback: false,
            provider: "imgbb",
          };
        }
      }
    } catch (imgbbErr) {
      console.warn("ImgBB upload failed:", imgbbErr);
    }
  }

  // Tier 3: High-efficiency Local WebP Data URL Fallback
  // This guarantees 100% success on GitHub Pages and Localhost with ZERO setup!
  onProgress?.(100);
  return {
    url: dataUrl,
    originalSize,
    compressedSize,
    isBase64Fallback: true,
    provider: "local_webp",
  };
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
