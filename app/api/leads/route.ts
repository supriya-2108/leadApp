import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectDB from "@/src/lib/mongodb";

const JWT_SECRET = process.env.NEXT_PUBLIC_.JWT_SECRET || "your-secret-key";

// Middleware to verify JWT
function verifyToken(req: NextRequest) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded as { userId: string };
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}

export async function GET(request: NextRequest) {
  const decoded = verifyToken(request);
  if (decoded instanceof NextResponse) return decoded; // Unauthorized

  // Your protected logic here (e.g., fetch leads for user)
  await connectDB();
  // ... (implement leads CRUD)

  return NextResponse.json({ message: "Protected data" });
}