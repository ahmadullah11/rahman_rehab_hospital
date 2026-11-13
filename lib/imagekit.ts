import ImageKit from "imagekit";

const publicKey = process.env.IMAGEKIT_PUBLIC_KEY || "";
const privateKey = process.env.IMAGEKIT_PRIVATE_KEY || "";
const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT || "";

export const isImageKitConfigured = (): boolean => {
  return Boolean(publicKey && privateKey && urlEndpoint);
};

let imagekit: ImageKit | null = null;

if (isImageKitConfigured()) {
  imagekit = new ImageKit({
    publicKey,
    privateKey,
    urlEndpoint,
  });
}

export function getImageKit(): ImageKit {
  if (!imagekit) {
    throw new Error("ImageKit is not configured. Please supply keys in .env.local");
  }
  return imagekit;
}

export async function uploadImageFile(
  fileBuffer: Buffer,
  fileName: string,
  folder = "/verdant-path"
): Promise<{ url: string; fileId: string; thumbnailUrl: string }> {
  if (!isImageKitConfigured()) {
    // Graceful fallback to data URI if credentials are not configured
    const base64 = fileBuffer.toString("base64");
    const mime = fileName.endsWith(".png")
      ? "image/png"
      : fileName.endsWith(".webp")
      ? "image/webp"
      : "image/jpeg";
    const dataUri = `data:${mime};base64,${base64}`;
    return {
      url: dataUri,
      fileId: "mock_" + Date.now(),
      thumbnailUrl: dataUri,
    };
  }

  const ik = getImageKit();
  const response = await ik.upload({
    file: fileBuffer,
    fileName,
    folder,
    useUniqueFileName: true,
  });

  return {
    url: response.url,
    fileId: response.fileId,
    thumbnailUrl: response.thumbnailUrl || response.url,
  };
}
