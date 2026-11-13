import { NextResponse } from "next/server";
import { getDb, isMongoConfigured, memoryStore, UserRecord } from "@/lib/mongodb";
import { hashPassword, signToken, setAuthCookie } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email, and password are required" }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();

    if (isMongoConfigured()) {
      const db = await getDb();
      const existing = await db.collection("users").findOne({ email: cleanEmail });
      if (existing) {
        return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 });
      }

      const passwordHash = await hashPassword(password);
      const newUser: UserRecord = {
        _id: "usr_" + Date.now(),
        name: name.trim(),
        email: cleanEmail,
        passwordHash,
        role: "user",
        createdAt: new Date(),
      };

      const result = await db.collection("users").insertOne(newUser as any);
      const userId = result.insertedId.toString();

      const payload = {
        userId,
        email: cleanEmail,
        name: newUser.name,
        role: "user" as const,
      };

      const token = signToken(payload);
      await setAuthCookie(token);

      return NextResponse.json({ success: true, user: payload });
    } else {
      const existing = memoryStore.users.find((u) => u.email.toLowerCase() === cleanEmail);
      if (existing) {
        return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 });
      }

      const passwordHash = await hashPassword(password);
      const userId = "usr_" + Date.now();
      const newUser: UserRecord = {
        _id: userId,
        name: name.trim(),
        email: cleanEmail,
        passwordHash,
        role: "user",
        createdAt: new Date(),
      };

      memoryStore.users.push(newUser);

      const payload = {
        userId,
        email: cleanEmail,
        name: newUser.name,
        role: "user" as const,
      };

      const token = signToken(payload);
      await setAuthCookie(token);

      return NextResponse.json({ success: true, user: payload });
    }
  } catch (error: any) {
    console.error("Signup error:", error);
    return NextResponse.json({ error: error.message || "Signup failed" }, { status: 500 });
  }
}
