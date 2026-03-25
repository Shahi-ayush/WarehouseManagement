


import { db } from "@/lib/db";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { email, phone, password, confirmPassword } = await req.json();

    // ✅ basic validation
    if (!email || !phone || !password || !confirmPassword) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // ✅ confirm password check
    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: "Passwords do not match" },
        { status: 400 }
      );
    }

    // ✅ check existing customer
    const existing = await db.customerAccount.findFirst({
      where: {
        OR: [{ email }, { phone }],
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Customer account already exists" },
        { status: 409 }
      );
    }

    // ✅ hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ create account
    const account = await db.customerAccount.create({
      data: {
        email,
        phone,
        password: hashedPassword,
      },
    });

    return NextResponse.json(
      {
        message: "Customer account created",
        accountId: account.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
