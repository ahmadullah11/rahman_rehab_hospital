"use server";

import { revalidatePath } from "next/cache";
import { ObjectId } from "mongodb";
import { getDb, isMongoConfigured, memoryStore, ProductItem, INITIAL_PRODUCTS } from "@/lib/mongodb";
import { uploadImageFile } from "@/lib/imagekit";

export interface ProductsFilter {
  category?: string;
  search?: string;
  sort?: "price_asc" | "price_desc" | "rating" | "newest";
  limit?: number;
}

export async function getProductsAction(filters?: ProductsFilter): Promise<{ success: boolean; products: ProductItem[]; error?: string }> {
  try {
    let products: ProductItem[] = [];

    if (isMongoConfigured()) {
      const db = await getDb();
      const query: any = {};

      if (filters?.category && filters.category !== "All") {
        query.category = { $regex: new RegExp(`^${filters.category}$`, "i") };
      }

      if (filters?.search && filters.search.trim()) {
        const s = filters.search.trim();
        query.$or = [
          { title: { $regex: s, $options: "i" } },
          { description: { $regex: s, $options: "i" } },
          { tags: { $in: [new RegExp(s, "i")] } },
        ];
      }

      let cursor = db.collection<ProductItem>("products").find(query);

      if (filters?.sort === "price_asc") {
        cursor = cursor.sort({ price: 1 });
      } else if (filters?.sort === "price_desc") {
        cursor = cursor.sort({ price: -1 });
      } else if (filters?.sort === "rating") {
        cursor = cursor.sort({ rating: -1 });
      } else {
        cursor = cursor.sort({ createdAt: -1 });
      }

      if (filters?.limit) {
        cursor = cursor.limit(filters.limit);
      }

      const dbProducts = await cursor.toArray();

      if (dbProducts.length === 0 && (!filters?.category || filters.category === "All") && !filters?.search) {
        await db.collection("products").insertMany(INITIAL_PRODUCTS as any);
        products = [...INITIAL_PRODUCTS];
      } else {
        products = dbProducts.map((p: any) => ({
          ...p,
          _id: p._id.toString(),
        }));
      }
    } else {
      let list = [...memoryStore.products];

      if (filters?.category && filters.category !== "All") {
        list = list.filter((p) => p.category.toLowerCase() === filters.category?.toLowerCase());
      }

      if (filters?.search && filters.search.trim()) {
        const s = filters.search.trim().toLowerCase();
        list = list.filter(
          (p) =>
            p.title.toLowerCase().includes(s) ||
            p.description.toLowerCase().includes(s) ||
            p.tags?.some((t) => t.toLowerCase().includes(s))
        );
      }

      if (filters?.sort === "price_asc") {
        list.sort((a, b) => a.price - b.price);
      } else if (filters?.sort === "price_desc") {
        list.sort((a, b) => b.price - a.price);
      } else if (filters?.sort === "rating") {
        list.sort((a, b) => b.rating - a.rating);
      } else {
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      }

      if (filters?.limit) {
        list = list.slice(0, filters.limit);
      }

      products = list;
    }

    return { success: true, products };
  } catch (error: any) {
    console.error("getProductsAction error:", error);
    return { success: false, products: INITIAL_PRODUCTS, error: error.message };
  }
}

export async function getProductByIdAction(idOrSlug: string): Promise<{ success: boolean; product: ProductItem | null; error?: string }> {
  try {
    let product: ProductItem | null = null;

    if (isMongoConfigured()) {
      const db = await getDb();
      let query: any = { slug: idOrSlug };

      if (ObjectId.isValid(idOrSlug)) {
        query = { $or: [{ _id: new ObjectId(idOrSlug) }, { slug: idOrSlug }, { _id: idOrSlug as any }] };
      }

      const res: any = await db.collection("products").findOne(query);
      if (res) {
        product = {
          ...res,
          _id: res._id.toString(),
        };
      }
    } else {
      product =
        memoryStore.products.find((p) => p._id === idOrSlug || p.slug === idOrSlug) ||
        INITIAL_PRODUCTS.find((p) => p._id === idOrSlug || p.slug === idOrSlug) ||
        null;
    }

    return { success: true, product };
  } catch (error: any) {
    console.error("getProductByIdAction error:", error);
    return { success: false, product: null, error: error.message };
  }
}

export async function createProductAction(formData: FormData): Promise<{ success: boolean; product?: ProductItem; error?: string }> {
  try {
    const title = (formData.get("title") as string)?.trim();
    const description = (formData.get("description") as string)?.trim();
    const price = Number(formData.get("price")) || 0;
    const originalPrice = Number(formData.get("originalPrice")) || undefined;
    const category = (formData.get("category") as string)?.trim() || "General Care";
    const stockCount = Number(formData.get("stockCount")) || 10;
    const inStock = formData.get("inStock") === "false" ? false : true;
    const featured = formData.get("featured") === "true";
    const tagsString = (formData.get("tags") as string) || "";
    const tags = tagsString ? tagsString.split(",").map((t) => t.trim()).filter(Boolean) : [];

    if (!title || price <= 0) {
      return { success: false, error: "Product title and a valid price are required." };
    }

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "") + "-" + Math.random().toString(36).substring(2, 6);

    let imageUrl = "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=800&q=80";
    let imageKitFileId: string | undefined = undefined;

    const file = formData.get("image") as File | null;
    if (file && file.size > 0) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const uploadRes = await uploadImageFile(buffer, file.name, "/verdant-path/products");
      imageUrl = uploadRes.url;
      imageKitFileId = uploadRes.fileId;
    } else {
      const existingUrl = (formData.get("imageUrl") as string)?.trim();
      if (existingUrl) imageUrl = existingUrl;
    }

    const newProduct: ProductItem = {
      _id: "prod_" + Date.now(),
      title,
      slug,
      description: description || "Professional clinical and psychiatric recovery program.",
      price,
      originalPrice,
      category,
      imageUrl,
      imageKitFileId,
      images: [imageUrl],
      inStock,
      stockCount,
      rating: 5.0,
      reviewsCount: 1,
      featured,
      tags,
      createdAt: new Date(),
    };

    if (isMongoConfigured()) {
      const db = await getDb();
      const insertRes = await db.collection("products").insertOne(newProduct as any);
      newProduct._id = insertRes.insertedId.toString();
    } else {
      memoryStore.products.unshift(newProduct);
    }

    revalidatePath("/products");
    revalidatePath("/dashboard");

    return { success: true, product: newProduct };
  } catch (error: any) {
    console.error("createProductAction error:", error);
    return { success: false, error: error.message || "Failed to create product" };
  }
}

export async function updateProductAction(id: string, formData: FormData): Promise<{ success: boolean; product?: ProductItem; error?: string }> {
  try {
    const title = (formData.get("title") as string)?.trim();
    const description = (formData.get("description") as string)?.trim();
    const price = formData.get("price") ? Number(formData.get("price")) : undefined;
    const category = (formData.get("category") as string)?.trim();
    const stockCount = formData.get("stockCount") ? Number(formData.get("stockCount")) : undefined;
    const inStock = formData.has("inStock") ? formData.get("inStock") === "true" : undefined;
    const featured = formData.has("featured") ? formData.get("featured") === "true" : undefined;

    const updateFields: any = { updatedAt: new Date() };
    if (title) updateFields.title = title;
    if (description) updateFields.description = description;
    if (price !== undefined) updateFields.price = price;
    if (category) updateFields.category = category;
    if (stockCount !== undefined) updateFields.stockCount = stockCount;
    if (inStock !== undefined) updateFields.inStock = inStock;
    if (featured !== undefined) updateFields.featured = featured;

    const file = formData.get("image") as File | null;
    if (file && file.size > 0) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const uploadRes = await uploadImageFile(buffer, file.name, "/verdant-path/products");
      updateFields.imageUrl = uploadRes.url;
      updateFields.imageKitFileId = uploadRes.fileId;
    }

    if (isMongoConfigured()) {
      const db = await getDb();
      let query: any = { _id: id };
      if (ObjectId.isValid(id)) {
        query = { $or: [{ _id: new ObjectId(id) }, { _id: id }] };
      }
      await db.collection("products").updateOne(query, { $set: updateFields });
    } else {
      const idx = memoryStore.products.findIndex((p) => p._id === id);
      if (idx !== -1) {
        memoryStore.products[idx] = { ...memoryStore.products[idx], ...updateFields };
      }
    }

    revalidatePath("/products");
    revalidatePath(`/products/${id}`);
    revalidatePath("/dashboard");

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteProductAction(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    if (isMongoConfigured()) {
      const db = await getDb();
      let query: any = { _id: id };
      if (ObjectId.isValid(id)) {
        query = { $or: [{ _id: new ObjectId(id) }, { _id: id }] };
      }
      await db.collection("products").deleteOne(query);
    } else {
      memoryStore.products = memoryStore.products.filter((p) => p._id !== id);
    }

    revalidatePath("/products");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
