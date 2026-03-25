
// import db from "@/lib/db";
import { db } from "@/lib/db";

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

// 🟢 CREATE unit (POST)
export async function POST(request) {
  try {
    const { 
    title,
    abbreviation
   } = await request.json();

    // ✅ Get logged-in user from session
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // ✅ Create unit linked to this user
    const unit = await db.unit.create({
      data: {
        title,
        abbreviation,
        userId: session.user.id,
      },
    });

    console.log("Created unit:", unit);
    return NextResponse.json(unit);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Failed to create unit", error },
      { status: 500 }
    );
  }
}

// 🟡 GET ALL unit (GET)
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // ✅ Fetch only the user's unit
    const units = await db.unit.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(units);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Failed to fetch unit", error },
      { status: 500 }
    );
  }
}

// 🔴 DELETE unit (DELETE)
export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const id = request.nextUrl.searchParams.get("id");

    // ✅ Ensure the category belongs to the logged-in user
    const unit = await db.unit.findUnique({ where: { id } });
    if (!unit || unit.userId !== session.user.id) {
      return NextResponse.json({ message: "Not authorized" }, { status: 403 });
    }

    const deletedUnit= await db.unit.delete({ where: { id } });
    console.log("Deleted unit:", deletedUnit);

    return NextResponse.json(deletedUnit);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Failed to delete unit", error },
      { status: 500 }
    );
  }
}
