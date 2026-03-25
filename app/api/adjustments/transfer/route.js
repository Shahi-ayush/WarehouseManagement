// import db from "@/lib/db"
// import { NextResponse } from "next/server"
// import { getServerSession } from "next-auth"
// import { authOptions } from "@/lib/authOptions"

// export async function POST(request) {
//   try {
//     const session = await getServerSession(authOptions)
//     const userId = session?.user?.id
//     if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

//     const { itemId, givingWarehouseId, receivingWarehouseId, transferStockQty, notes, referenceNumber } = await request.json()
//     const qty = parseInt(transferStockQty)

//     // Validation: quantity must be > 0
//     if (qty <= 0) return NextResponse.json({ message: "Quantity must be greater than zero" }, { status: 400 })

//     // Fetch item in giving warehouse for this user
//     const givingItem = await db.item.findFirst({ where: { id: itemId, warehouseId: givingWarehouseId, userId } })
//     if (!givingItem) return NextResponse.json({ message: "Item not found in giving warehouse" }, { status: 404 })

//     // ✅ Validation: check if quantity available is enough
//     if (givingItem.quantity < qty) {
//       return NextResponse.json({ message: `Insufficient stock. Available: ${givingItem.quantity}`, status: 400 })
//     }

//     // Deduct from giving warehouse
//     await db.item.update({ where: { id: givingItem.id }, data: { quantity: givingItem.quantity - qty } })

//     // Add to receiving warehouse
//     let receivingItem = await db.item.findFirst({ where: { sku: givingItem.sku, warehouseId: receivingWarehouseId, userId } })
//     if (receivingItem) {
//       await db.item.update({ where: { id: receivingItem.id }, data: { quantity: receivingItem.quantity + qty } })
//     } else {
//       await db.item.create({ data: { ...givingItem, id: undefined, quantity: qty, warehouseId: receivingWarehouseId, userId } })
//     }

//     // Create adjustment record
//     const adjustment = await db.transferStockAdjustment.create({
//       data: { itemId, givingWarehouseId, receivingWarehouseId, transferStockQty: qty, notes, referenceNumber, userId }
//     })

//     return NextResponse.json(adjustment)
//   } catch (error) {
//     console.error(error)
//     return NextResponse.json({ message: "Failed to transfer stock", error }, { status: 500 })
//   }
// }




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
      transferStockQty,
      itemId,
      givingWarehouseId,
      receivingWarehouseId,
      notes,
      referenceNumber,
    } = await request.json();

    const qtyToTransfer = parseInt(transferStockQty);
    if (qtyToTransfer <= 0)
      return NextResponse.json(
        { message: "Quantity must be greater than zero" },
        { status: 400 }
      );

    // --- Get base item ---
    const baseItem = await db.item.findUnique({ where: { id: itemId } });
    if (!baseItem)
      return NextResponse.json({ message: "Item not found" }, { status: 404 });

    // --- Get giving warehouse item for this user ---
    const givingItem = await db.item.findFirst({
      where: {
        sku: baseItem.sku,
        warehouseId: givingWarehouseId,
        userId,
      },
    });
    if (!givingItem)
      return NextResponse.json(
        { message: "Giving warehouse has no stock for this item" },
        { status: 404 }
      );

    if (givingItem.quantity < qtyToTransfer)
      return NextResponse.json(
        { message: `Not enough stock. Available: ${givingItem.quantity}` },
        { status: 400 }
      );

    // --- Update giving warehouse stock ---
    await db.item.update({
      where: { id: givingItem.id },
      data: { quantity: givingItem.quantity - qtyToTransfer },
    });

    // --- Update or create receiving warehouse item ---
    let receivingItem = await db.item.findFirst({
      where: {
        sku: givingItem.sku,
        warehouseId: receivingWarehouseId,
        userId,
      },
    });

    if (receivingItem) {
      await db.item.update({
        where: { id: receivingItem.id },
        data: { quantity: receivingItem.quantity + qtyToTransfer },
      });
    } else {
      await db.item.create({
        data: {
          title: givingItem.title,
          description: givingItem.description,
          categoryId: givingItem.categoryId,
          sku: givingItem.sku,
          barcode: givingItem.barcode,
          quantity: qtyToTransfer,
          unitId: givingItem.unitId,
          brandId: givingItem.brandId,
          warehouseId: receivingWarehouseId,
          sellingPrice: givingItem.sellingPrice,
          buyingPrice: givingItem.buyingPrice,
          supplierId: givingItem.supplierId,
          reOrderPoint: givingItem.reOrderPoint,
          imageUrl: givingItem.imageUrl,
          weight: givingItem.weight,
          dimensions: givingItem.dimensions,
          taxRate: givingItem.taxRate,
          notes: givingItem.notes,
          userId,
        },
      });
    }

    // --- Record transfer adjustment ---
    const adjustment = await db.transferStockAdjustment.create({
      data: {
        itemId,
        referenceNumber,
        transferStockQty: qtyToTransfer,
        givingWarehouseId,
        receivingWarehouseId,
        notes,
        userId,
      },
    });

    return NextResponse.json(adjustment);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to transfer stock", error: error.message },
      { status: 500 }
    );
  }
}



export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const givingWarehouseId = searchParams.get("givingWarehouseId");

    if (!givingWarehouseId) {
      return NextResponse.json([], { status: 200 }); // return empty array if no warehouse selected
    }

    const items = await db.item.findMany({
      where: {
        warehouseId: givingWarehouseId,
        userId,
        quantity: { gt: 0 },
      },
      select: { id: true, title: true, quantity: true }, // only necessary fields
      orderBy: { title: "asc" },
    });

    return NextResponse.json(items);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Failed to fetch items", error: error.message }, { status: 500 });
  }
}


export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    if (!userId)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const id = request.nextUrl.searchParams.get("id");
    if (!id)
      return NextResponse.json({ message: "Adjustment ID required" }, { status: 400 });

    const adjustment = await db.transferStockAdjustment.findUnique({
      where: { id },
    });

    if (!adjustment || adjustment.userId !== userId)
      return NextResponse.json({ message: "Not found" }, { status: 404 });

    const deletedAdjustment = await db.transferStockAdjustment.delete({
      where: { id },
    });

    return NextResponse.json(deletedAdjustment);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to delete adjustment", error: error.message },
      { status: 500 }
    );
  }
}






