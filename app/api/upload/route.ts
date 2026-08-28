import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary server-side SDK
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "r28lk4ms",
  api_key: process.env.CLOUDINARY_API_KEY || "668366647883424",
  api_secret: process.env.CLOUDINARY_API_SECRET || "hy4B5MKcxEJHDnTdovU1KNP-JUg",
  secure: true,
});

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "rc-gadgets";
    const explicitType = (formData.get("resource_type") as string) || "auto";

    if (!file) {
      return NextResponse.json(
        { error: "No file provided for upload" },
        { status: 400 }
      );
    }

    const isVideo =
      file.type.startsWith("video/") ||
      explicitType === "video" ||
      /\.(mp4|webm|mov|mkv|avi|m4v)$/i.test(file.name);

    // Max size caps to prevent bandwidth/storage overuse
    const MAX_VIDEO_BYTES = 40 * 1024 * 1024; // 40MB max for video
    const MAX_IMAGE_BYTES = 12 * 1024 * 1024; // 12MB max for image

    if (isVideo && file.size > MAX_VIDEO_BYTES) {
      return NextResponse.json(
        {
          error: `Video size (${(file.size / (1024 * 1024)).toFixed(1)}MB) exceeds maximum limit of 40MB. Please trim or compress the video before uploading.`,
        },
        { status: 400 }
      );
    }

    if (!isVideo && file.size > MAX_IMAGE_BYTES) {
      return NextResponse.json(
        {
          error: `Image size (${(file.size / (1024 * 1024)).toFixed(1)}MB) exceeds maximum limit of 12MB.`,
        },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Cloudinary using upload_stream with auto-compression transformations
    const uploadOptions: Record<string, any> = {
      folder: `rc-gadgets/${folder}`,
      resource_type: isVideo ? "video" : "image",
    };

    if (isVideo) {
      uploadOptions.quality = "auto:eco"; // High compression efficiency for rapid video delivery
      uploadOptions.fetch_format = "auto";
      uploadOptions.video_codec = "auto";
    } else {
      uploadOptions.quality = "auto:good";
      uploadOptions.fetch_format = "auto";
    }

    const uploadResult = await new Promise<{
      secure_url: string;
      public_id: string;
      format: string;
      resource_type: string;
      bytes: number;
      width?: number;
      height?: number;
      duration?: number;
    }>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        uploadOptions,
        (error, result) => {
          if (error || !result) {
            reject(error || new Error("Failed to upload to Cloudinary"));
          } else {
            resolve(result as any);
          }
        }
      );

      uploadStream.end(buffer);
    });

    return NextResponse.json({
      success: true,
      url: uploadResult.secure_url,
      public_id: uploadResult.public_id,
      format: uploadResult.format,
      resource_type: uploadResult.resource_type,
      bytes: uploadResult.bytes,
      width: uploadResult.width,
      height: uploadResult.height,
      duration: uploadResult.duration,
    });
  } catch (error: any) {
    console.error("Cloudinary upload API error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process media upload" },
      { status: 500 }
    );
  }
}
