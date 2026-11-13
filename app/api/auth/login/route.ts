import { NextResponse } from "next/server";
import { getDb, isMongoConfigured, memoryStore } from "@/lib/mongodb";
import { signToken, setAuthCookie, comparePassword } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    let user: any = null;

    if (isMongoConfigured()) {
      const db = await getDb();
      user = await db.collection("users").findOne({ email: email.toLowerCase().trim() });
    } else {
      user = memoryStore.users.find((u) => u.email.toLowerCase() === email.toLowerCase().trim());
    }

    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    let valid = false;
    if (user.passwordHash.startsWith("$2a$") || user.passwordHash.startsWith("$2b$")) {
      valid = await comparePassword(password, user.passwordHash);
    } else {
      valid = user.passwordHash === password;
    }

    if (!valid) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const payload = {
      userId: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role || "user",
    };

    const token = signToken(payload);
    await setAuthCookie(token);

    return NextResponse.json({
      success: true,
      user: payload,
    });
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json({ error: error.message || "Login failed" }, { status: 500 });
  }
}
