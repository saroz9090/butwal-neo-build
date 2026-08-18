import React, { useState, useRef } from "react";
import { 
  UploadCloud, 
  Image as ImageIcon, 
  CheckCircle2, 
  Loader2, 
  X, 
  Sparkles, 
  Copy, 
  Check, 
  Link as LinkIcon,
  Settings,
  Cloud
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  uploadImageToFreeCloud, 
  formatBytes, 
  UploadResult,
  getCloudinaryConfig,
  saveCloudinaryConfig
} from "@/lib/imageUpload";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface ImageUploadDropzoneProps {
  id?: string;
  label?: string;
  helperText?: string;
  value?: string;
  onChange: (url: string) => void;
  onMultipleAdd?: (urls: string[]) => void;
  allowMultiple?: boolean;
  forMarkdownBlog?: boolean;
  className?: string;
}

export const ImageUploadDropzone: React.FC<ImageUploadDropzoneProps> = ({
  id,
  label = "Upload Image",
  helperText,
  value,
  onChange,
  onMultipleAdd,
  allowMultiple = false,
  forMarkdownBlog = false,
  className = "",
}) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [lastResult, setLastResult] = useState<UploadResult | null>(null);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [manualUrl, setManualUrl] = useState("");
  const [showConfigModal, setShowConfigModal] = useState(false);
  
  const currentConfig = getCloudinaryConfig();
  const [cloudNameInput, setCloudNameInput] = useState(currentConfig.cloudName);
  const [presetInput, setPresetInput] = useState(currentConfig.uploadPreset);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const validFiles = Array.from(files).filter(f => f.type.startsWith("image/"));
    if (validFiles.length === 0) {
      toast({
        title: "Invalid File Type",
        description: "Please select valid image files (JPG, PNG, WebP, etc.).",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    setProgress(10);

    try {
      const uploadedUrls: string[] = [];
      let totalOriginal = 0;
      let totalCompressed = 0;
      let hasCloud = false;

      for (let i = 0; i < validFiles.length; i++) {
        const file = validFiles[i];
        const result = await uploadImageToFreeCloud(file, (p) => {
          setProgress(10 + Math.round((i / validFiles.length) * 85 + (p / 100) * (85 / validFiles.length)));
        });

        uploadedUrls.push(result.url);
        totalOriginal += result.originalSize;
        totalCompressed += result.compressedSize;
        if (!result.isBase64Fallback) hasCloud = true;
        setLastResult(result);
      }

      setProgress(100);

      if (allowMultiple && onMultipleAdd) {
        onMultipleAdd(uploadedUrls);
        toast({
          title: "Images Processed & Compressed!",
          description: `${uploadedUrls.length} image(s) processed. ${hasCloud ? "Stored on Cloud CDN." : "Optimized as high-speed WebP."}`,
        });
      } else if (uploadedUrls.length > 0) {
        onChange(uploadedUrls[0]);
        toast({
          title: "Image Uploaded Successfully",
          description: `Compressed from ${formatBytes(totalOriginal)} to ${formatBytes(totalCompressed)}.`,
        });
      }
    } catch (err) {
      console.error("Upload error:", err);
      toast({
        title: "Upload Notice",
        description: err instanceof Error ? err.message : "Could not process image.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const copyMarkdownSnippet = (url: string) => {
    const snippet = `\n\n![Image Description](${url})\n\n`;
    navigator.clipboard.writeText(snippet);
    setCopiedUrl(url);
    toast({
      title: "Markdown Tag Copied!",
      description: "Paste it anywhere in your article text to position the image.",
    });
    setTimeout(() => setCopiedUrl(null), 3000);
  };

  const applyManualUrl = () => {
    if (!manualUrl.trim()) return;
    if (allowMultiple && onMultipleAdd) {
      onMultipleAdd([manualUrl.trim()]);
    } else {
      onChange(manualUrl.trim());
    }
    setManualUrl("");
    setShowUrlInput(false);
    toast({ title: "Image URL Applied", description: "Image link attached successfully." });
  };

  const handleSaveCloudinary = () => {
    saveCloudinaryConfig(cloudNameInput, presetInput);
    setShowConfigModal(false);
    toast({
      title: "Cloud Settings Saved",
      description: "Your Cloudinary settings will be used for future uploads.",
    });
  };

  return (
    <div className={`space-y-2.5 ${className}`}>
      {label && (
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-foreground uppercase tracking-wider flex items-center gap-1.5">
            <UploadCloud className="w-3.5 h-3.5 text-primary" />
            {label}
          </label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowUrlInput(!showUrlInput)}
              className="text-[11px] text-primary hover:underline flex items-center gap-1"
            >
              <LinkIcon className="w-3 h-3" />
              {showUrlInput ? "Hide Link" : "Paste Link"}
            </button>
            <button
              type="button"
              onClick={() => setShowConfigModal(true)}
              className="text-[11px] text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors"
              title="Configure Cloud CDN / Local Storage"
            >
              <Settings className="w-3 h-3" />
              <span>Storage</span>
            </button>
            <span className="text-[11px] text-emerald-500 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Auto WebP
            </span>
          </div>
        </div>
      )}

      {/* Optional Direct URL Input Bar */}
      {showUrlInput && (
        <div className="flex items-center gap-2 p-2 bg-muted/40 rounded-md border border-border animate-in fade-in duration-150">
          <Input
            value={manualUrl}
            onChange={(e) => setManualUrl(e.target.value)}
            placeholder="Paste image link (e.g. https://...)"
            className="text-xs h-8"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                applyManualUrl();
              }
            }}
          />
          <Button type="button" size="sm" onClick={applyManualUrl} className="h-8 text-xs px-3">
            Attach
          </Button>
        </div>
      )}

      {/* Dropzone Box */}
      <div
        id={id}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isUploading && fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all duration-200 ${
          isDragging
            ? "border-primary bg-primary/10 scale-[0.99]"
            : "border-border/80 hover:border-primary/60 hover:bg-muted/30"
        } ${isUploading ? "pointer-events-none opacity-80" : ""}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple={allowMultiple}
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />

        {isUploading ? (
          <div className="py-4 flex flex-col items-center justify-center space-y-2.5">
            <Loader2 className="w-7 h-7 animate-spin text-primary" />
            <div className="text-sm font-medium text-foreground">
              Processing & Compressing Image... {progress}%
            </div>
            <div className="w-56 h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        ) : (
          <div className="py-2 flex flex-col items-center justify-center space-y-1.5">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-1">
              <UploadCloud className="w-5 h-5" />
            </div>
            <p className="text-sm font-semibold text-foreground">
              <span className="text-primary hover:underline">Click to upload from Device</span> or drag & drop
            </p>
            <p className="text-xs text-muted-foreground">
              {helperText || (allowMultiple ? "Select one or multiple photos (JPG, PNG, WebP)" : "Select a photo from Computer or Mobile gallery")}
            </p>
          </div>
        )}
      </div>

      {/* Compression summary & thumbnail badge */}
      {lastResult && (
        <div className="flex items-center justify-between bg-emerald-950/20 border border-emerald-500/20 rounded-md px-3 py-2 text-xs text-emerald-600 dark:text-emerald-400 animate-in fade-in">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>
              {lastResult.isBase64Fallback ? "Optimized WebP: " : "Cloud CDN: "}
              {formatBytes(lastResult.originalSize)} ➔ <strong>{formatBytes(lastResult.compressedSize)}</strong> (
              {Math.round((1 - lastResult.compressedSize / lastResult.originalSize) * 100)}% smaller)
            </span>
          </div>
          {forMarkdownBlog && lastResult.url && (
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                copyMarkdownSnippet(lastResult.url);
              }}
              className="h-6 text-[11px] px-2.5 gap-1 border-emerald-500/30 hover:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
            >
              {copiedUrl === lastResult.url ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              Copy Markdown Tag
            </Button>
          )}
        </div>
      )}

      {/* Current Preview if single value is provided and non-empty */}
      {!allowMultiple && Boolean(value && value.trim()) && (
        <div className="flex items-center gap-3 p-2.5 bg-muted/30 rounded-lg border border-border">
          <div className="w-16 h-16 rounded-md overflow-hidden bg-background shrink-0 border border-border relative">
            <img src={value} alt="Preview" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-mono text-foreground truncate">{value.startsWith("data:") ? "High-speed WebP Image" : value}</p>
            <p className="text-xs text-emerald-500 mt-1 flex items-center gap-1 font-medium">
              <ImageIcon className="w-3.5 h-3.5" /> Ready for display
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onChange("")}
            className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive shrink-0"
            title="Remove image"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Cloud Storage Configuration Dialog */}
      <Dialog open={showConfigModal} onOpenChange={setShowConfigModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Cloud className="w-5 h-5 text-primary" />
              Image & Media Storage Settings
            </DialogTitle>
            <DialogDescription>
              Images are automatically optimized and compressed. If you want external Cloud CDN URLs when deploying to GitHub Pages or local server, you can optionally configure your Cloudinary credentials below.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">Cloudinary Cloud Name</label>
              <Input
                value={cloudNameInput}
                onChange={(e) => setCloudNameInput(e.target.value)}
                placeholder="e.g., your_cloud_name"
                className="text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">Unsigned Upload Preset</label>
              <Input
                value={presetInput}
                onChange={(e) => setPresetInput(e.target.value)}
                placeholder="e.g., your_upload_preset"
                className="text-xs"
              />
            </div>
            <div className="p-3 bg-muted/50 rounded-lg text-xs text-muted-foreground space-y-1">
              <p className="font-semibold text-foreground">💡 Zero-Config Fallback:</p>
              <p>Even without Cloudinary keys, the system automatically uses client-side WebP compression (to ~15KB), so your image uploads will always work seamlessly on GitHub Pages and local development servers.</p>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setShowConfigModal(false)}>
                Cancel
              </Button>
              <Button type="button" size="sm" className="bg-primary text-white" onClick={handleSaveCloudinary}>
                Save Settings
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
