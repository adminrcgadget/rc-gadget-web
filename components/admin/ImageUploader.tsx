"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { UploadCloud, X, Check, AlertCircle, Loader2 } from "lucide-react";

interface ImageUploaderProps {
  currentUrl?: string | null;
  bucket?: string;
  folder?: string;
  label?: string;
  onUploadSuccess: (url: string) => void;
  onUploadingStateChange?: (isUploading: boolean) => void;
  onRemove?: () => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  currentUrl,
  folder = "uploads",
  label,
  onUploadSuccess,
  onUploadingStateChange,
  onRemove,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentUrl || null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync state if currentUrl changes
  React.useEffect(() => {
    setPreviewUrl(currentUrl || null);
  }, [currentUrl]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg(null);
    setSuccessMsg(null);

    // 1. Validation: File type
    const validTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/jpg",
      "image/svg+xml",
    ];
    if (!validTypes.includes(file.type)) {
      setErrorMsg("Please upload a valid image file (JPG, PNG, WebP, SVG).");
      return;
    }

    // 2. Validation: File size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg("File size exceeds 10MB limit. Please choose a smaller image.");
      return;
    }

    // Instant local preview
    const localPreview = URL.createObjectURL(file);
    setPreviewUrl(localPreview);

    // 3. Upload via server route /api/upload (with 60s timeout)
    setIsUploading(true);
    if (onUploadingStateChange) onUploadingStateChange(true);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const result = await response.json();

      if (!response.ok || !result.url) {
        throw new Error(result.error || "Upload failed");
      }

      setPreviewUrl(result.url);
      setSuccessMsg("Uploaded successfully!");
      onUploadSuccess(result.url);
    } catch (err: any) {
      clearTimeout(timeoutId);
      console.error("Upload error:", err);
      const msg =
        err.name === "AbortError"
          ? "Upload timed out — please try a smaller image or check your connection."
          : err.message || "Failed to upload image";
      setErrorMsg(msg);
    } finally {
      setIsUploading(false);
      if (onUploadingStateChange) onUploadingStateChange(false);
    }
  };

  const handleClear = () => {
    setPreviewUrl(null);
    setErrorMsg(null);
    setSuccessMsg(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (onRemove) onRemove();
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block">
          {label}
        </label>
      )}

      {/* Preview and Upload Box */}
      <div className="border-2 border-dashed border-gray-200 hover:border-[#FF5A00]/60 rounded-2xl p-4 bg-gray-50/70 hover:bg-orange-50/20 transition-all">
        {previewUrl ? (
          <div className="relative w-full h-44 sm:h-52 rounded-xl overflow-hidden bg-white border border-gray-200/80 group flex items-center justify-center p-2 shadow-xs">
            <Image
              src={previewUrl}
              alt="Preview"
              fill
              sizes="300px"
              className="object-contain p-2"
            />

            {/* Overlay buttons */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-xs">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 rounded-xl bg-[#FF5A00] text-white text-xs font-black uppercase tracking-wider hover:bg-[#FF6A00] transition-colors shadow-md shadow-[#FF5A00]/30"
              >
                Change
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="p-2 rounded-xl bg-rose-600 text-white hover:bg-rose-700 transition-colors shadow-md"
                aria-label="Remove image"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center justify-center py-7 px-4 text-center cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-2xl bg-white group-hover:bg-[#FF5A00]/10 border border-gray-200 group-hover:border-[#FF5A00]/40 flex items-center justify-center text-gray-400 group-hover:text-[#FF5A00] transition-all mb-2.5 shadow-xs">
              <UploadCloud className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-gray-800 uppercase tracking-wider group-hover:text-[#FF5A00] transition-colors">
              Click or drag image to upload
            </span>
            <span className="text-[11px] text-gray-400 mt-0.5">
              Supports JPG, PNG, WebP (Max 10MB)
            </span>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/svg+xml"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* Loading state */}
      {isUploading && (
        <div className="flex items-center gap-2 text-xs text-[#FF5A00] font-semibold py-1">
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          <span>Uploading directly to cloud storage...</span>
        </div>
      )}

      {/* Status Messages */}
      {successMsg && (
        <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold py-1">
          <Check className="w-3.5 h-3.5" />
          <span>{successMsg}</span>
        </div>
      )}
      {errorMsg && (
        <div className="flex items-center gap-1.5 text-xs text-rose-600 font-semibold py-1">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}
    </div>
  );
};
