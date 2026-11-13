import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb, isMongoConfigured, memoryStore } from "@/lib/mongodb";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (isMongoConfigured()) {
      const db = await getDb();
      let query: any = { _id: id };
      if (ObjectId.isValid(id)) {
        query = { $or: [{ _id: new ObjectId(id) }, { _id: id }] };
      }
      await db.collection("gallery").deleteOne(query);
    } else {
      memoryStore.gallery = memoryStore.gallery.filter((g) => g._id !== id);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
