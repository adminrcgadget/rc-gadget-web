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
  label = "Upload Image (Cloudinary)",
  onUploadSuccess,
  onUploadingStateChange,
  onRemove,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentUrl || null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg(null);
    setSuccessMsg(null);

    // 1. Validation: File type
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg", "image/svg+xml"];
    if (!validTypes.includes(file.type)) {
      setErrorMsg("Please upload a valid image file (JPG, PNG, WebP, SVG).");
      return;
    }

    // 2. Validation: File size (10MB max for Cloudinary)
    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg("File size exceeds 10MB limit. Please choose a smaller image.");
      return;
    }

    // Instant local preview
    const localPreview = URL.createObjectURL(file);
    setPreviewUrl(localPreview);

    // 3. Upload to Cloudinary via server route /api/upload
    setIsUploading(true);
    if (onUploadingStateChange) onUploadingStateChange(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok || !result.url) {
        throw new Error(result.error || "Upload failed");
      }

      setPreviewUrl(result.url);
      setSuccessMsg("Uploaded to Cloudinary successfully!");
      onUploadSuccess(result.url);
    } catch (err: any) {
      console.error("Cloudinary upload error:", err);
      setErrorMsg(err.message || "Failed to upload image to Cloudinary");
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
        <label className="text-xs font-black uppercase tracking-wider text-zinc-300 block">
          {label}
        </label>
      )}

      {/* Preview and Upload Box */}
      <div className="border-2 border-dashed border-white/15 hover:border-[#FF5500]/60 rounded-2xl p-4 bg-[#111111] transition-all">
        {previewUrl ? (
          <div className="relative w-full h-44 sm:h-52 rounded-xl overflow-hidden bg-black/60 border border-white/10 group">
            <Image
              src={previewUrl}
              alt="Preview"
              fill
              sizes="300px"
              className="object-contain"
            />

            {/* Overlay buttons */}
            <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3.5 py-1.5 rounded-lg bg-[#FF5500] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#FF6A1A] transition-colors"
              >
                Change
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="p-1.5 rounded-lg bg-rose-600/80 text-white hover:bg-rose-600 transition-colors"
                aria-label="Remove image"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center justify-center py-8 px-4 text-center cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-xl bg-white/5 group-hover:bg-[#FF5500]/15 group-hover:border-[#FF5500]/40 border border-white/10 flex items-center justify-center text-zinc-400 group-hover:text-[#FF5500] transition-all mb-3">
              <UploadCloud className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-white uppercase tracking-wider group-hover:text-[#FF5500] transition-colors">
              Click or drag image to upload to Cloudinary
            </span>
            <span className="text-[11px] text-zinc-500 mt-1">
              Supports JPG, PNG, WebP, SVG (Max 10MB)
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
        <div className="flex items-center gap-2 text-xs text-[#FF5500] font-semibold py-1">
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          <span>Uploading directly to Cloudinary...</span>
        </div>
      )}

      {/* Status Messages */}
      {successMsg && (
        <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold py-1">
          <Check className="w-3.5 h-3.5" />
          <span>{successMsg}</span>
        </div>
      )}
      {errorMsg && (
        <div className="flex items-center gap-1.5 text-xs text-rose-400 font-semibold py-1">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}
    </div>
  );
};
