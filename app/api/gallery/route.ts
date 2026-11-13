import { NextResponse } from "next/server";
import { getDb, isMongoConfigured, memoryStore, DEFAULT_GALLERY_IMAGES, GalleryItem } from "@/lib/mongodb";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");

    let images: GalleryItem[] = [];

    if (isMongoConfigured()) {
      const db = await getDb();
      const query = category && category !== "All" ? { category } : {};
      const res = await db.collection("gallery").find(query).sort({ createdAt: -1 }).toArray();

      if (res.length === 0 && (!category || category === "All")) {
        await db.collection("gallery").insertMany(DEFAULT_GALLERY_IMAGES as any);
        images = DEFAULT_GALLERY_IMAGES;
      } else {
        images = res.map((img: any) => ({
          _id: img._id.toString(),
          title: img.title,
          category: img.category,
          description: img.description,
          imageUrl: img.imageUrl,
          thumbnailUrl: img.thumbnailUrl,
          isSlider: img.isSlider !== false,
          createdAt: img.createdAt,
        }));
      }
    } else {
      if (category && category !== "All") {
        images = memoryStore.gallery.filter((i) => i.category.toLowerCase() === category.toLowerCase());
      } else {
        images = memoryStore.gallery;
      }
    }

    return NextResponse.json({
      success: true,
      items: images,
      images,
      mongoConnected: isMongoConfigured(),
    });
  } catch (error: any) {
    console.error("Gallery fetch error:", error);
    return NextResponse.json({
      success: false,
      items: DEFAULT_GALLERY_IMAGES,
      images: DEFAULT_GALLERY_IMAGES,
      mongoConnected: false,
    });
  }
}
