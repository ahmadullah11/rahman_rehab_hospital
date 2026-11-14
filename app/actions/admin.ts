"use server";

import { revalidatePath } from "next/cache";
import { ObjectId } from "mongodb";
import { getDb, isMongoConfigured, memoryStore } from "@/lib/mongodb";

export interface DashboardStats {
  totalUsers: number;
  totalVisitors: number;
}

export async function getDashboardStatsAction(): Promise<{ success: boolean; stats: DashboardStats; error?: string }> {
  try {
    let totalUsers = 0;
    let totalVisitors = 0;

    if (isMongoConfigured()) {
      const db = await getDb();
      totalUsers = await db.collection("users").countDocuments();
      totalVisitors = await db.collection("visitors").countDocuments();
    } else {
      totalUsers = memoryStore.users.length;
      totalVisitors = memoryStore.visitors.length;
    }

    return {
      success: true,
      stats: {
        totalUsers,
        totalVisitors,
      },
    };
  } catch (error: any) {
    console.error("getDashboardStatsAction error:", error);
    return {
      success: false,
      error: error.message,
      stats: {
        totalUsers: 0,
        totalVisitors: 0,
      },
    };
  }
}

export async function getAllUsersAction(): Promise<{ success: boolean; users: any[]; error?: string }> {
  try {
    let users: any[] = [];

    if (isMongoConfigured()) {
      const db = await getDb();
      const res = await db.collection("users").find({}).sort({ createdAt: -1 }).toArray();
      users = res.map((u: any) => ({
        _id: u._id.toString(),
        name: u.name,
        email: u.email,
        role: u.role,
        phone: u.phone || "",
        createdAt: u.createdAt,
      }));
    } else {
      users = memoryStore.users.map((u) => ({
        _id: u._id,
        name: u.name,
        email: u.email,
        role: u.role,
        phone: u.phone || "",
        createdAt: u.createdAt,
      }));
    }

    return { success: true, users };
  } catch (error: any) {
    console.error("getAllUsersAction error:", error);
    return { success: false, users: [], error: error.message };
  }
}

export async function updateUserRoleAction(userId: string, role: "admin" | "user"): Promise<{ success: boolean; error?: string }> {
  try {
    if (isMongoConfigured()) {
      const db = await getDb();
      let query: any = { _id: userId };
      if (ObjectId.isValid(userId)) {
        query = { $or: [{ _id: new ObjectId(userId) }, { _id: userId }] };
      }
      await db.collection("users").updateOne(query, { $set: { role, updatedAt: new Date() } });
    } else {
      const user = memoryStore.users.find((u) => u._id === userId);
      if (user) {
        user.role = role;
      }
    }

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteUserAction(userId: string): Promise<{ success: boolean; error?: string }> {
  try {
    if (isMongoConfigured()) {
      const db = await getDb();
      let query: any = { _id: userId };
      if (ObjectId.isValid(userId)) {
        query = { $or: [{ _id: new ObjectId(userId) }, { _id: userId }] };
      }
      await db.collection("users").deleteOne(query);
    } else {
      memoryStore.users = memoryStore.users.filter((u) => u._id !== userId);
    }

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
