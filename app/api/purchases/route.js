


import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { NextResponse } from "next/server";

// // GET all sales/purchases for reports
// export async function GET() {
//   try {
//     const sales = await db.sale.findMany({
//       include: { items: true },
//       orderBy: { createdAt: "desc" },
//     });
//     return NextResponse.json(sales);
//   } catch (err) {
//     console.error(err);
//     return NextResponse.json({ message: "Failed to fetch purchases" }, { status: 500 });
//   }
// }


export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json([], { status: 401 });
    }

    const sales = await db.sale.findMany({
      where: {
        userId, // ✅ THIS FIXES EVERYTHING
      },
      include: { items: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(sales);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Failed to fetch purchases" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    if (!userId)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { customerId, items } = await req.json();

    if (!customerId || !items?.length)
      return NextResponse.json({ message: "Missing data" }, { status: 400 });

    const total = items.reduce(
      (acc, i) => acc + i.qty * i.sellingPrice,
      0
    );

    const sale = await db.$transaction(async (tx) => {
      // 🔒 stock validation
      for (const i of items) {
        const dbItem = await tx.item.findUnique({
          where: { id: i.id },
          select: { quantity: true },
        });

        if (!dbItem || dbItem.quantity < i.qty) {
          throw new Error(`Not enough stock for item ${i.title}`);
        }
      }

      // 🧾 create sale
      const sale = await tx.sale.create({
        data: {
          customerId,
          total,
          notes: JSON.stringify(
            items.map((i) => ({ itemId: i.id, qty: i.qty }))
          ),
          userId,
          items: {
            create: items.map((i) => ({
              itemId: i.id,
              name: i.title,
              qty: i.qty,
            })),
          },
        },
        include: { items: true },
      });

      // 📉 update stock
      for (const i of items) {
        await tx.item.update({
          where: { id: i.id },
          data: {
            quantity: {
              decrement: i.qty,
            },
          },
        });
      }

      return sale;
    });

    return NextResponse.json({ success: true, sale });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: err.message || "Server error" },
      { status: 500 }
    );
  }
}
