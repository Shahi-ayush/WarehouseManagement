// import db from "@/lib/db";
import { db } from "@/lib/db";

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const {
      referenceNumber,
      itemId,
      transferStockQty,
      givingWarehouseId,
      receivingWarehouseId,
      notes,
    } = await request.json();

    // ✅ Fetch item in giving warehouse (user-specific)
    const itemToTransfer = await db.item.findFirst({
      where: { id: itemId, warehouseId: givingWarehouseId, userId },
    });

    if (!itemToTransfer) {
      return NextResponse.json(
        { message: "Item not found in the source warehouse" },
        { status: 404 }
      );
    }

    if (itemToTransfer.quantity < transferStockQty) {
      return NextResponse.json(
        { message: "Insufficient stock" },
        { status: 400 }
      );
    }

    // --- Reduce quantity in giving warehouse ---
    await db.item.update({
      where: { id: itemToTransfer.id },
      data: { quantity: itemToTransfer.quantity - transferStockQty },
    });

    // --- Add quantity in receiving warehouse ---
    const receivingItem = await db.item.findFirst({
      where: { id: itemId, warehouseId: receivingWarehouseId, userId },
    });

    if (receivingItem) {
      await db.item.update({
        where: { id: receivingItem.id },
        data: { quantity: receivingItem.quantity + transferStockQty },
      });
    }

    // --- Create adjustment record ---
    const adjustment = await db.transferStockAdjustment.create({
      data: {
        referenceNumber,
        transferStockQty: parseInt(transferStockQty),
        givingWarehouseId,
        receivingWarehouseId,
        notes,
        itemId,
        userId,
      },
    });

    return NextResponse.json(adjustment);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Failed to create transfer adjustment", error },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    if (!userId)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const adjustments = await db.transferStockAdjustment.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(adjustments);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Failed to fetch adjustments", error },
      { status: 500 }
    );
  }
}
