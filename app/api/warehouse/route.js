
// import db from "@/lib/db";
import { db } from "@/lib/db";

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

// 🟢 CREATE warehouse (POST)
export async function POST(request) {
  try {
    const { 
   title,
    location,
    description,
  warehouseType:type,
   } = await request.json();

    // ✅ Get logged-in user from session
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // ✅ Create warehouse linked to this user
    const warehouse = await db.warehouse.create({
      data: {
      title,
    location,
    description,
  warehouseType:type,
        userId: session.user.id,
      },
    });

    console.log("Created warehouse:", warehouse);
    return NextResponse.json(warehouse);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Failed to create warehouse", error },
      { status: 500 }
    );
  }
}

// 🟡 GET ALL warehouse (GET)
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // ✅ Fetch only the user's warehouse
    const warehouse = await db.warehouse.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
        include: {
        items: true,
       
      },
    });

    return NextResponse.json(warehouse);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Failed to fetch warehouse", error },
      { status: 500 }
    );
  }
}

// 🔴 DELETE warehouse (DELETE)
export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const id = request.nextUrl.searchParams.get("id");

    // ✅ Ensure the category belongs to the logged-in user
    const warehouse = await db.warehouse.findUnique({ where: { id } });
    if (!warehouse || warehouse.userId !== session.user.id) {
      return NextResponse.json({ message: "Not authorized" }, { status: 403 });
    }

    const deletedWarehouse = await db.warehouse.delete({ where: { id } });
    console.log("Deleted warehouse:", deletedWarehouse);

    return NextResponse.json(deletedWarehouse);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Failed to delete warehouse", error },
      { status: 500 }
    );
  }
}

