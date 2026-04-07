

import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { NextResponse } from "next/server";



export async function DELETE(req, context) {
  try {
    const { params } = context;
    const { id } = await params; // get the customer ID from the URL

    // 1️⃣ Delete the customer
    await db.customer.delete({
      where: { id },
    });

    // 2️⃣ Unlink any accounts linked to this customer AND reset status
    await db.customerAccount.updateMany({
      where: { customerId: id },
      data: {
        customerId: null,       // remove the link
        status: "unverified",   // reset status
      },
    });

    return NextResponse.json({ message: "Customer deleted and accounts unlinked successfully" });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Failed to delete customer" },
      { status: 500 }
    );
  }
}
export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const url = new URL(req.url);
    const pathParts = url.pathname.split("/");
    const customerId = pathParts[pathParts.length - 1];

    if (!customerId)
      return NextResponse.json({ message: "Missing customer ID" }, { status: 400 });

    const customer = await db.customer.findFirst({
      where: { id: customerId, userId },
      include: {
        sales: { orderBy: { createdAt: "desc" } },
        payments: true,
      },
    });

    if (!customer)
      return NextResponse.json({ message: "Customer not found" }, { status: 404 });

    // Map item IDs from sales notes
    const itemIds = customer.sales.flatMap(sale => {
      if (!sale.notes) return [];
      try { return JSON.parse(sale.notes).map(i => i.itemId); } catch { return []; }
    });

    const items = await db.item.findMany({
      where: { id: { in: itemIds } },
      select: { id: true, title: true },
    });

    const itemMap = Object.fromEntries(items.map(i => [i.id, i.title]));

    const totalSales = customer.sales.reduce((sum, s) => sum + s.total, 0);
    const totalPaid = customer.payments.reduce((sum, p) => sum + p.amount, 0);
    const balance = totalSales - totalPaid;

    const summary = { totalSales, totalPaid, balance };

    return NextResponse.json({ customer, itemMap, summary });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
