"use server";

import { uploadImageFile, isImageKitConfigured } from "@/lib/imagekit";

export async function uploadImageAction(formData: FormData): Promise<{
  success: boolean;
  url?: string;
  fileId?: string;
  error?: string;
}> {
  try {
    const file = formData.get("file") as File | null;
    if (!file) {
      return { success: false, error: "No file provided" };
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const folder = (formData.get("folder") as string) || "/verdant-path";
    const result = await uploadImageFile(buffer, file.name, folder);

    return {
      success: true,
      url: result.url,
      fileId: result.fileId,
    };
  } catch (error: any) {
    console.error("uploadImageAction error:", error);
    return { success: false, error: error.message || "Failed to upload image" };
  }
}
