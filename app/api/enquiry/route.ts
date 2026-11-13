import { NextResponse } from "next/server";
import { getDb, isMongoConfigured, memoryStore, EnquiryRecord } from "@/lib/mongodb";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name = body.name;
    const phone = body.phone;
    const email = body.email;
    const enquiryFor = body.enquiryFor || body.topic || "General Inquiry";
    const message = body.message || body.msg || "";

    if (!name || (!phone && !email)) {
      return NextResponse.json({ error: "Name and at least phone or email are required" }, { status: 400 });
    }

    const enquiry: EnquiryRecord = {
      name: name.trim(),
      phone: (phone || "").trim(),
      email: email ? email.trim() : undefined,
      enquiryFor: enquiryFor,
      message: message ? message.trim() : "",
      createdAt: new Date(),
    };

    if (isMongoConfigured()) {
      const db = await getDb();
      await db.collection("enquiries").insertOne(enquiry as any);
    } else {
      memoryStore.enquiries.unshift(enquiry);
    }

    return NextResponse.json({
      success: true,
      message: "Enquiry submitted successfully",
    });
  } catch (error: any) {
    console.error("Enquiry error:", error);
    return NextResponse.json({ error: error.message || "Failed to submit enquiry" }, { status: 500 });
  }
}

export async function GET() {
  try {
    if (isMongoConfigured()) {
      const db = await getDb();
      const enquiries = await db.collection("enquiries").find({}).sort({ createdAt: -1 }).toArray();
      return NextResponse.json({ enquiries });
    } else {
      return NextResponse.json({ enquiries: memoryStore.enquiries });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
