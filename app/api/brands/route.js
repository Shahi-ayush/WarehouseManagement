
// import db from "@/lib/db";
import { db } from "@/lib/db";

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

// 🟢 CREATE brand (POST)
export async function POST(request) {
  try {
    const { 
    title
   } = await request.json();

    // ✅ Get logged-in user from session
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // ✅ Create brand linked to this user
    const brand = await db.brand.create({
      data: {
        title,
        userId: session.user.id,
      },
    });

    console.log("Created brand:", brand);
    return NextResponse.json(brand);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Failed to create brand", error },
      { status: 500 }
    );
  }
}

// 🟡 GET ALL brand (GET)
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // ✅ Fetch only the user's brand
    const brands = await db.brand.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(brands);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Failed to fetch brand", error },
      { status: 500 }
    );
  }
}

// 🔴 DELETE brand (DELETE)
export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const id = request.nextUrl.searchParams.get("id");

    // ✅ Ensure the category belongs to the logged-in user
    const brand = await db.brand.findUnique({ where: { id } });
    if (!brand || brand.userId !== session.user.id) {
      return NextResponse.json({ message: "Not authorized" }, { status: 403 });
    }

    const deletedbrand = await db.brand.delete({ where: { id } });
    console.log("Deleted brand:", deletedbrand);

    return NextResponse.json(deletedbrand);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Failed to delete brand", error },
      { status: 500 }
    );
  }
}
