// import db from "@/lib/db";
import { db } from "@/lib/db";

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

// 🟢 CREATE CATEGORY (POST)
export async function POST(request) {
  try {
    const { title, description } = await request.json();

    // ✅ Get logged-in user from session
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // ✅ Create category linked to this user
    const category = await db.category.create({
      data: {
        title,
        description,
        userId: session.user.id,
      },
    });

    console.log("Created category:", category);
    return NextResponse.json(category);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Failed to create category", error },
      { status: 500 }
    );
  }
}

// 🟡 GET ALL CATEGORIES (GET)
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // ✅ Fetch only the user's categories
    const categories = await db.category.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Failed to fetch categories", error },
      { status: 500 }
    );
  }
}

// 🔴 DELETE CATEGORY (DELETE)
export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const id = request.nextUrl.searchParams.get("id");

    // ✅ Ensure the category belongs to the logged-in user
    const category = await db.category.findUnique({ where: { id } });
    if (!category || category.userId !== session.user.id) {
      return NextResponse.json({ message: "Not authorized" }, { status: 403 });
    }

    const deletedCategory = await db.category.delete({ where: { id } });
    console.log("Deleted category:", deletedCategory);

    return NextResponse.json(deletedCategory);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Failed to delete category", error },
      { status: 500 }
    );
  }
}
