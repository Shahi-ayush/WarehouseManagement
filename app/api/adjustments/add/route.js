// import db from "@/lib/db"
import { db } from "@/lib/db";

import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/authOptions"

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    const userId = session?.user?.id
    if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

    const { itemId, receivingWarehouseId, addStockQty, notes, referenceNumber, supplierId } = await request.json()
    const qty = parseInt(addStockQty)
    if (qty <= 0) return NextResponse.json({ message: "Quantity must be greater than zero" }, { status: 400 })

    const item = await db.item.findFirst({ where: { id: itemId, warehouseId: receivingWarehouseId, userId } })
    if (!item) return NextResponse.json({ message: "Item not found in this warehouse" }, { status: 404 })

    await db.item.update({ where: { id: item.id }, data: { quantity: item.quantity + qty } })

    const adjustment = await db.addStockAdjustment.create({
      data: { itemId, receivingWarehouseId, addStockQty: qty, notes, referenceNumber, supplierId, userId }
    })

    return NextResponse.json(adjustment)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: "Failed to add stock", error }, { status: 500 })
  }
}



export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const receivingWarehouseId = searchParams.get("receivingWarehouseId");

    if (!receivingWarehouseId) {
      return NextResponse.json([], { status: 200 });
    }

    const items = await db.item.findMany({
      where: {
        warehouseId: receivingWarehouseId,
        userId,
        quantity: { gt: 0 }, // only items with stock > 0
      },
      select: { id: true, title: true, quantity: true },
      orderBy: { title: "asc" },
    });

    return NextResponse.json(items);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Failed to fetch items", error: error.message }, { status: 500 });
  }
}
