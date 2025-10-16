import { experimental_generateImage } from "ai";
import type { ImageModel } from "ai";
import { uploadImage, type StorageConfig } from "@/services/storage-service";

export interface ImageGenerationOptions {
  prompt: string;
  model: ImageModel;
  storageConfig: StorageConfig;
  filename?: string;
  size?: "1024x1024" | "1792x1024" | "1024x1792";
}

export interface ImageGenerationResult {
  success: boolean;
  url?: string;
  error?: string;
  metadata?: {
    prompt: string;
    modelId: string;
    storageProvider: string;
    filename: string;
    size: number;
  };
}

export async function generateAndStoreImage({
  prompt,
  model,
  storageConfig,
  filename,
  size = "1024x1024"
}: ImageGenerationOptions): Promise<ImageGenerationResult> {
  try {
    const result = await experimental_generateImage({
      model: model as ImageModel,
      prompt,
      size
    });

    if (!result.images || result.images.length === 0) {
      return {
        success: false,
        error: "No images generated"
      };
    }

    const imageData = result.images[0];
    const finalFilename = filename || `generated-${Date.now()}.png`;

    // Convert base64 to buffer if needed
    let imageBuffer: Buffer;
    if (typeof imageData === "string") {
      // Remove data URL prefix if present
      const base64Data = imageData.replace(/^data:image\/[a-z]+;base64,/, "");
      imageBuffer = Buffer.from(base64Data, "base64");
    } else {
      imageBuffer = imageData;
    }

    // Upload to storage
    const uploadResult = await uploadImage(
      storageConfig.provider,
      storageConfig,
      imageBuffer,
      finalFilename
    );

    if (!uploadResult.success) {
      return {
        success: false,
        error: uploadResult.error || "Failed to upload image to storage"
      };
    }

    return {
      success: true,
      url: uploadResult.url,
      metadata: {
        prompt,
        modelId: model.modelId || "unknown",
        storageProvider: storageConfig.provider,
        filename: finalFilename,
        size: imageBuffer.length
      }
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Unknown error occurred during image generation"
    };
  }
}
