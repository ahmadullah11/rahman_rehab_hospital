"use server";

import { revalidatePath } from "next/cache";
import { ObjectId } from "mongodb";
import { getDb, isMongoConfigured, memoryStore, INITIAL_PRODUCTS } from "@/lib/mongodb";

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalUsers: number;
  totalVisitors: number;
  pendingOrdersCount: number;
  recentOrders: any[];
  lowStockProducts: any[];
  categoryStats: Record<string, number>;
}

export async function getDashboardStatsAction(): Promise<{ success: boolean; stats: DashboardStats; error?: string }> {
  try {
    let totalRevenue = 0;
    let totalOrders = 0;
    let totalProducts = 0;
    let totalUsers = 0;
    let totalVisitors = 0;
    let pendingOrdersCount = 0;
    let recentOrders: any[] = [];
    let lowStockProducts: any[] = [];
    const categoryStats: Record<string, number> = {};

    if (isMongoConfigured()) {
      const db = await getDb();

      totalProducts = await db.collection("products").countDocuments();
      const products = await db.collection("products").find({}).toArray();
      products.forEach((p: any) => {
        categoryStats[p.category] = (categoryStats[p.category] || 0) + 1;
        if (p.stockCount <= 5 || !p.inStock) {
          lowStockProducts.push({
            id: p._id.toString(),
            title: p.title,
            stockCount: p.stockCount,
            inStock: p.inStock,
          });
        }
      });

      totalOrders = await db.collection("orders").countDocuments();
      pendingOrdersCount = await db.collection("orders").countDocuments({ status: "pending" });
      const orders = await db.collection("orders").find({}).sort({ createdAt: -1 }).toArray();

      orders.forEach((o: any) => {
        if (o.status !== "cancelled") {
          totalRevenue += o.totalAmount || 0;
        }
      });

      recentOrders = orders.slice(0, 5).map((o: any) => ({
        _id: o._id.toString(),
        orderNumber: o.orderNumber,
        customerName: o.customerName,
        totalAmount: o.totalAmount,
        status: o.status,
        createdAt: o.createdAt,
      }));

      totalUsers = await db.collection("users").countDocuments();
      totalVisitors = await db.collection("visitors").countDocuments();
    } else {
      const products = memoryStore.products.length ? memoryStore.products : INITIAL_PRODUCTS;
      totalProducts = products.length;
      products.forEach((p) => {
        categoryStats[p.category] = (categoryStats[p.category] || 0) + 1;
        if (p.stockCount <= 5 || !p.inStock) {
          lowStockProducts.push({
            id: p._id,
            title: p.title,
            stockCount: p.stockCount,
            inStock: p.inStock,
          });
        }
      });

      const orders = memoryStore.orders;
      totalOrders = orders.length;
      pendingOrdersCount = orders.filter((o) => o.status === "pending").length;
      orders.forEach((o) => {
        if (o.status !== "cancelled") {
          totalRevenue += o.totalAmount || 0;
        }
      });

      recentOrders = orders.slice(0, 5);
      totalUsers = memoryStore.users.length;
      totalVisitors = memoryStore.visitors.length || 142;
    }

    return {
      success: true,
      stats: {
        totalRevenue,
        totalOrders,
        totalProducts,
        totalUsers,
        totalVisitors,
        pendingOrdersCount,
        recentOrders,
        lowStockProducts,
        categoryStats,
      },
    };
  } catch (error: any) {
    console.error("getDashboardStatsAction error:", error);
    return {
      success: false,
      error: error.message,
      stats: {
        totalRevenue: 0,
        totalOrders: 0,
        totalProducts: 0,
        totalUsers: 0,
        totalVisitors: 0,
        pendingOrdersCount: 0,
        recentOrders: [],
        lowStockProducts: [],
        categoryStats: {},
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
