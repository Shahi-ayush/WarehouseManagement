import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyCustomerToken } from "@/lib/auth";

export async function GET(req) {
  try {
    const decoded = verifyCustomerToken(req);

    const account = await db.customerAccount.findUnique({
      where: { id: decoded.accountId },
    });

    if (!account?.customerId) {
      return NextResponse.json(
        { error: "Customer not linked" },
        { status: 400 }
      );
    }

    const customerId = account.customerId;

    // Purchases
    const purchases = await db.sale.findMany({
      where: { customerId },
      orderBy: { createdAt: "desc" },
      take: 5, // last 5
       include: { items: true }, // <--- include item names here
    });

    const totalSpent = await db.sale.aggregate({
      _sum: { total: true },
      where: { customerId },
    });

    // Payments
    const payments = await db.payment.findMany({
      where: { customerId },
      orderBy: { createdAt: "desc" },
      take: 5, // last 5
    });

    const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);

    return NextResponse.json({
      totalSpent: totalSpent._sum.total || 0,
      totalPaid,
      dueBalance: (totalSpent._sum.total || 0) - totalPaid,
      recentPurchases: purchases,
      recentPayments: payments,
    });

  } catch (error) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }
}
