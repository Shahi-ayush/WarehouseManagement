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

    const purchases = await db.sale.findMany({
      where: { customerId: account.customerId },
      orderBy: { createdAt: "desc" },
      include: { items: true },
    });

    return NextResponse.json({
      count: purchases.length,
      purchases,
    });

  } catch (error) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }
}
