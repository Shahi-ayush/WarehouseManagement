import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyCustomerToken } from "@/lib/auth";

export async function POST(req) {
  try {
    const decoded = verifyCustomerToken(req);

    const account = await db.customerAccount.findUnique({
      where: { id: decoded.accountId },
    });

    if (!account) {
      return NextResponse.json(
        { error: "Account not found" },
        { status: 404 }
      );
    }

    // already linked
    if (account.customerId) {
      return NextResponse.json({
        message: "Customer already linked",
        customerId: account.customerId,
      });
    }

    // find customer by phone
    const customer = await db.customer.findFirst({
      where: { phone: account.phone },
    });

    if (!customer) {
      return NextResponse.json({
        message: "No customer found to link",
      });
    }

    await db.customerAccount.update({
      where: { id: account.id },
      data: { customerId: customer.id },
    });

    return NextResponse.json({
      message: "Customer linked successfully",
      customerId: customer.id,
    });

  } catch (error) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }
}
