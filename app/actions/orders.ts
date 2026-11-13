"use server";

import { revalidatePath } from "next/cache";
import { ObjectId } from "mongodb";
import { getDb, isMongoConfigured, memoryStore, OrderItem } from "@/lib/mongodb";
import { getSessionUser } from "@/lib/auth";

export async function createOrderAction(data: {
  customerName?: string;
  customerEmail?: string;
  phone?: string;
  shippingAddress?: {
    address: string;
    city: string;
    postalCode?: string;
    country?: string;
  };
  customerDetails?: {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
    city?: string;
    postalCode?: string;
    notes?: string;
  };
  items: Array<{
    productId: string;
    title: string;
    price: number;
    quantity: number;
    imageUrl: string;
  }>;
  totalAmount?: number;
  paymentMethod: "cod" | "bank_transfer" | "card" | string;
  paymentStatus?: "pending" | "paid" | "failed";
  notes?: string;
  couponCode?: string;
}): Promise<{ success: boolean; orderNumber?: string; order?: OrderItem; error?: string }> {
  try {
    const customerName = data.customerName || data.customerDetails?.name || "Patient";
    const customerEmail = data.customerEmail || data.customerDetails?.email || "patient@verdantpath.com";
    const phone = data.phone || data.customerDetails?.phone || "";
    const shippingAddress = data.shippingAddress || {
      address: data.customerDetails?.address || "Inpatient Care",
      city: data.customerDetails?.city || "Peshawar",
      postalCode: data.customerDetails?.postalCode || "25000",
      country: "PK",
    };

    if (!data.items || data.items.length === 0) {
      return { success: false, error: "Please provide order items." };
    }

    const session = await getSessionUser();
    const orderNumber = "VP-" + Math.floor(100000 + Math.random() * 900000);

    const subtotal = data.items.reduce((acc, i) => acc + i.price * i.quantity, 0);
    let discount = 0;
    if (data.couponCode && (data.couponCode.toUpperCase() === "RECOVERY10" || data.couponCode.toUpperCase() === "WELLNESS10")) {
      discount = Math.round(subtotal * 0.1);
    }
    const shippingFee = subtotal >= 500 ? 0 : 25;
    const computedTotal = Math.max(0, subtotal - discount + shippingFee);
    const finalTotal = data.totalAmount ?? computedTotal;

    const paymentMethodNormalized: "cod" | "bank_transfer" | "card" =
      data.paymentMethod === "card"
        ? "card"
        : data.paymentMethod === "bank_transfer"
        ? "bank_transfer"
        : "cod";

    const newOrder: OrderItem = {
      _id: "ord_" + Date.now(),
      orderNumber,
      userId: session?.userId,
      customerName,
      customerEmail,
      phone,
      shippingAddress,
      items: data.items,
      subtotal,
      discount,
      shippingFee,
      totalAmount: finalTotal,
      paymentMethod: paymentMethodNormalized,
      paymentStatus: (data.paymentStatus || (paymentMethodNormalized === "card" ? "paid" : "pending")) as any,
      status: "pending",
      notes: data.notes || data.customerDetails?.notes,
      createdAt: new Date(),
    };

    if (isMongoConfigured()) {
      const db = await getDb();
      const insertRes = await db.collection("orders").insertOne(newOrder as any);
      newOrder._id = insertRes.insertedId.toString();
    } else {
      memoryStore.orders.unshift(newOrder);
    }

    revalidatePath("/profile");
    revalidatePath("/dashboard");

    return { success: true, orderNumber, order: newOrder };
  } catch (error: any) {
    console.error("createOrderAction error:", error);
    return { success: false, error: error.message || "Failed to create order" };
  }
}

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
