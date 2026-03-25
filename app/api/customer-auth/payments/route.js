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

    const payments = await db.payment.findMany({
      where: { customerId: account.customerId },
      orderBy: { createdAt: "desc" },
    });

    const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);

    return NextResponse.json({
      count: payments.length,
      totalPaid,
      payments,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }
}
