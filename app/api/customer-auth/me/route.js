import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(req) {
  try {
    const authHeader = req.headers.get("authorization");

    // 1. Check token exists
    if (!authHeader) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 });
    }

    // 2. Remove "Bearer "
    const token = authHeader.split(" ")[1];

    // 3. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Success
    return NextResponse.json({
      message: "You are logged in",
      user: decoded,
    });

  } catch (err) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
