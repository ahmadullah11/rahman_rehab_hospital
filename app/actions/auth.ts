"use server";

import { ObjectId } from "mongodb";
import { getDb, isMongoConfigured, memoryStore, UserRecord } from "@/lib/mongodb";
import { getSessionUser, hashPassword, comparePassword } from "@/lib/auth";

export async function getProfileAction(): Promise<{ success: boolean; user?: any; error?: string }> {
  try {
    const session = await getSessionUser();
    if (!session) {
      return { success: false, error: "Not authenticated" };
    }

    if (isMongoConfigured()) {
      const db = await getDb();
      let query: any = { _id: session.userId };
      if (ObjectId.isValid(session.userId)) {
        query = { $or: [{ _id: new ObjectId(session.userId) }, { _id: session.userId }] };
      }
      const user = await db.collection("users").findOne(query);
      if (!user) return { success: false, error: "User not found" };

      return {
        success: true,
        user: {
          _id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone || "",
          address: user.address || "",
          city: user.city || "",
          createdAt: user.createdAt,
        },
      };
    } else {
      const user = memoryStore.users.find((u) => u._id === session.userId);
      if (!user) return { success: false, error: "User not found" };

      return {
        success: true,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone || "",
          address: user.address || "",
          city: user.city || "",
          createdAt: user.createdAt,
        },
      };
    }
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateProfileAction(
  arg1: string | { name?: string; phone?: string; address?: string; city?: string },
  arg2?: { name?: string; phone?: string; address?: string; city?: string }
): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await getSessionUser();
    const targetUserId = typeof arg1 === "string" ? arg1 : session?.userId;
    const data = typeof arg1 === "string" ? (arg2 || {}) : arg1;

    if (!targetUserId && !session) return { success: false, error: "Not authenticated" };
    const effectiveId = targetUserId || session?.userId;

    if (isMongoConfigured()) {
      const db = await getDb();
      let query: any = { _id: effectiveId };
      if (effectiveId && ObjectId.isValid(effectiveId)) {
        query = { $or: [{ _id: new ObjectId(effectiveId) }, { _id: effectiveId }] };
      }
      await db.collection("users").updateOne(query, {
        $set: {
          ...data,
          updatedAt: new Date(),
        },
      });
    } else {
      const user = memoryStore.users.find((u) => u._id === effectiveId);
      if (user) {
        if (data.name) user.name = data.name;
        if (data.phone) user.phone = data.phone;
        if (data.address) user.address = data.address;
        if (data.city) user.city = data.city;
        user.updatedAt = new Date();
      }
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
