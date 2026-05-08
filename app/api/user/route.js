
// import db from "@/lib/db";
import { db } from "@/lib/db";

import { hash } from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        {
          message: "Name, email, and password are required",
        },
        { status: 400 }
      );
    }

    // Check if user email already Exists
    const userExist = await db.user.findUnique({
      where: { email },
    });
    if (userExist) {
      return NextResponse.json(
        {
          message: "User Already exists",
          user: null,
        },
        { status: 409 }
      );
    }
    const hashedPassword = await hash(password, 10);
    const newUser = await db.user.create({
      data: {
        name,
        email,
        hashedPassword,
      },
    });

    return NextResponse.json(
      {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("User signup failed:", error);
    return NextResponse.json(
      {
        message: "Unable to create user right now",
      },
      { status: 500 }
    );
  }
}
