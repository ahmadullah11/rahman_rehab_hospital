import { NextResponse } from "next/server";
import { getDb, isMongoConfigured, memoryStore, GalleryItem } from "@/lib/mongodb";
import { uploadImageFile } from "@/lib/imagekit";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const title = (formData.get("title") as string) || "Center Photo";
    const category = (formData.get("category") as string) || "Rooms";
    const description = (formData.get("description") as string) || "";
    const isSlider = formData.get("isSlider") === "true";

    if (!file) {
      return NextResponse.json({ error: "No image file provided" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const uploadRes = await uploadImageFile(buffer, file.name, "/verdant-path/gallery");

    const newImage: GalleryItem = {
      _id: "gal_" + Date.now(),
      title,
      category,
      description,
      imageUrl: uploadRes.url,
      thumbnailUrl: uploadRes.thumbnailUrl,
      isSlider,
      createdAt: new Date(),
    };

    if (isMongoConfigured()) {
      const db = await getDb();
      const insertRes = await db.collection("gallery").insertOne(newImage as any);
      newImage._id = insertRes.insertedId.toString();
    } else {
      memoryStore.gallery.unshift(newImage);
    }

    return NextResponse.json({
      success: true,
      image: newImage,
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: error.message || "Failed to upload image" }, { status: 500 });
  }
}
