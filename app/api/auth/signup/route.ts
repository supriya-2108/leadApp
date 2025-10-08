import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import User from "@/src/models/User";
import connectDB from "@/src/lib/mongodb"; 

const JWT_SECRET = process.env.NEXT_PUBLIC_JWT_SECRET || "1111@123"; 

export async function POST(request: NextRequest) {
  try {
    console.log('signup')
    await connectDB();
    const { name, email, password } = await request.json();

    // Basic validation
    if (!name || !email || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    const user = new User({ name, email, password });
    await user.save();

    // Generate JWT
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "7d" });

    return NextResponse.json({ token, user: { id: user._id, name, email } });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}