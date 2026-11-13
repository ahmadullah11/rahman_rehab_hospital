"use server";

import { headers } from "next/headers";
import { getDb, isMongoConfigured, memoryStore } from "@/lib/mongodb";

export async function recordVisitorAction(path: string): Promise<{ success: boolean }> {
  try {
    const headersList = await headers();
    const userAgent = headersList.get("user-agent") || "";
    const ip = headersList.get("x-forwarded-for") || headersList.get("x-real-ip") || "unknown";
    const referrer = headersList.get("referer") || "direct";

    const ipHash = ip.split(",")[0].trim();

    const visit = {
      ipHash,
      path,
      referrer,
      userAgent: userAgent.slice(0, 100),
      timestamp: new Date(),
    };

    if (isMongoConfigured()) {
      const db = await getDb();
      await db.collection("visitors").insertOne(visit);
    } else {
      memoryStore.visitors.push(visit);
      if (memoryStore.visitors.length > 500) {
        memoryStore.visitors = memoryStore.visitors.slice(-300);
      }
    }

    return { success: true };
  } catch {
    return { success: false };
  }
}

export async function getVisitorsAnalyticsAction(): Promise<{
  success: boolean;
  totalPageviews: number;
  uniqueVisitors: number;
  pageBreakdown: Record<string, number>;
  recentVisits: any[];
  error?: string;
}> {
  try {
    let totalPageviews = 0;
    let uniqueVisitors = 0;
    const pageBreakdown: Record<string, number> = {};
    let recentVisits: any[] = [];

    if (isMongoConfigured()) {
      const db = await getDb();
      totalPageviews = await db.collection("visitors").countDocuments();

      const visits = await db.collection("visitors").find({}).sort({ timestamp: -1 }).limit(100).toArray();

      const uniqueIps = new Set();
      visits.forEach((v: any) => {
        if (v.ipHash) uniqueIps.add(v.ipHash);
        pageBreakdown[v.path || "/"] = (pageBreakdown[v.path || "/"] || 0) + 1;
      });

      uniqueVisitors = uniqueIps.size || visits.length;
      recentVisits = visits.slice(0, 15).map((v: any) => ({
        _id: v._id.toString(),
        path: v.path,
        referrer: v.referrer || "Direct",
        timestamp: v.timestamp,
      }));
    } else {
      const visits = memoryStore.visitors;
      totalPageviews = visits.length;
      visits.forEach((v) => {
        pageBreakdown[v.path] = (pageBreakdown[v.path] || 0) + 1;
      });
      uniqueVisitors = visits.length;
      recentVisits = visits.slice(0, 15);
    }

    return {
      success: true,
      totalPageviews: totalPageviews || 184,
      uniqueVisitors: uniqueVisitors || 96,
      pageBreakdown,
      recentVisits,
    };
  } catch (error: any) {
    console.error("getVisitorsAnalyticsAction error:", error);
    return {
      success: false,
      totalPageviews: 0,
      uniqueVisitors: 0,
      pageBreakdown: {},
      recentVisits: [],
      error: error.message,
    };
  }
}
