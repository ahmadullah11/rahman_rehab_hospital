"use server";

import { revalidatePath } from "next/cache";
import { ObjectId } from "mongodb";
import { getDb, isMongoConfigured, memoryStore, OrderItem } from "@/lib/mongodb";
import { getSessionUser } from "@/lib/auth";

export async function getUserOrdersAction(targetUserId?: string): Promise<{ success: boolean; orders: OrderItem[]; error?: string }> {
  try {
    const session = await getSessionUser();
    const effectiveUserId = targetUserId || session?.userId;
    if (!effectiveUserId && !session) return { success: true, orders: [] };
    if (!session) return { success: true, orders: [] };

    let orders: OrderItem[] = [];

    if (isMongoConfigured()) {
      const db = await getDb();
      const res = await db
        .collection("orders")
        .find({ $or: [{ userId: session.userId }, { customerEmail: session.email }] })
        .sort({ createdAt: -1 })
        .toArray();

      orders = res.map((o: any) => ({
        ...o,
        _id: o._id.toString(),
      }));
    } else {
      orders = memoryStore.orders.filter(
        (o) => o.userId === session.userId || o.customerEmail.toLowerCase() === session.email.toLowerCase()
      );
    }

    return { success: true, orders };
  } catch (error: any) {
    return { success: false, orders: [], error: error.message };
  }
}

export async function getAllOrdersAction(status?: string): Promise<{ success: boolean; orders: OrderItem[]; error?: string }> {
  try {
    let orders: OrderItem[] = [];

    if (isMongoConfigured()) {
      const db = await getDb();
      const query = status && status !== "all" ? { status } : {};
      const res = await db.collection("orders").find(query).sort({ createdAt: -1 }).toArray();
      orders = res.map((o: any) => ({
        ...o,
        _id: o._id.toString(),
      }));
    } else {
      orders = status && status !== "all"
        ? memoryStore.orders.filter((o) => o.status === status)
        : [...memoryStore.orders];
    }

    return { success: true, orders };
  } catch (error: any) {
    return { success: false, orders: [], error: error.message };
  }
}

export async function updateOrderStatusAction(
  orderId: string,
  status: OrderItem["status"]
): Promise<{ success: boolean; error?: string }> {
  try {
    if (isMongoConfigured()) {
      const db = await getDb();
      let query: any = { _id: orderId };
      if (ObjectId.isValid(orderId)) {
        query = { $or: [{ _id: new ObjectId(orderId) }, { _id: orderId }] };
      }
      await db.collection("orders").updateOne(query, {
        $set: { status, updatedAt: new Date() },
      });
    } else {
      const order = memoryStore.orders.find((o) => o._id === orderId);
      if (order) {
        order.status = status;
        order.updatedAt = new Date();
      }
    }

    revalidatePath("/dashboard");
    revalidatePath("/profile");

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
