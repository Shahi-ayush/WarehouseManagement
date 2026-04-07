import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/verifyToken";

export async function POST(req) {
  try {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.split(" ")[1];
    const decoded = verifyToken(token);

    if (!decoded?.accountId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { amount } = await req.json();

    if (!amount || Number(amount) <= 0) {
      return NextResponse.json({ message: "Invalid amount" }, { status: 400 });
    }

    // 👇 Find customerAccount first, then get linked customer
    const account = await db.customerAccount.findUnique({
      where: { id: decoded.accountId },
    });

    if (!account?.customerId) {
      return NextResponse.json({ message: "Customer not linked" }, { status: 404 });
    }

    const customer = await db.customer.findUnique({
      where: { id: account.customerId },
      include: { payments: true, sales: true },
    });

    if (!customer) {
      return NextResponse.json({ message: "Customer not found" }, { status: 404 });
    }

    const totalSales = customer.sales.reduce((sum, s) => sum + s.total, 0);
    const totalPaid = customer.payments.reduce((sum, p) => sum + p.amount, 0);
    const balance = totalSales - totalPaid;

    if (Number(amount) > balance) {
      return NextResponse.json({ message: "Amount exceeds due balance" }, { status: 400 });
    }

    const khaltiRes = await fetch("https://dev.khalti.com/api/v2/epayment/initiate/", {
      method: "POST",
      headers: {
        Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/customer-auth/khalti-verify`,
        website_url: process.env.NEXT_PUBLIC_SITE_URL,
        amount: Number(amount) * 100,
        purchase_order_id: `${customer.id}-${Date.now()}`,
        purchase_order_name: "Due Payment",
        customer_info: {
          name: customer.name || "Customer",
        },
        merchant_extra: JSON.stringify({
          customerId: customer.id,
            userId: customer.userId, 
          amount: Number(amount),
        }),
      }),
    });

    const khaltiData = await khaltiRes.json();
    console.log("Khalti response:", khaltiData);

    if (!khaltiData.payment_url) {
      return NextResponse.json(
        { message: khaltiData?.detail || "Khalti initiation failed" },
        { status: 400 }
      );
    }

    return NextResponse.json({ payment_url: khaltiData.payment_url });
  } catch (err) {
    console.error("Khalti initiate error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}