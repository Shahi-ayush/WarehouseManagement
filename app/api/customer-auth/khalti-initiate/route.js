import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/verifyToken";

function createPurchaseOrderId(customerId, accountId, amount) {
  return ["due", customerId, accountId, Number(amount), Date.now()].join("__");
}

function getSiteUrl(req) {
  return new URL(req.url).origin;
}

function getKhaltiConfig() {
  const mode = (process.env.KHALTI_ENV || "sandbox").toLowerCase();

  if (mode === "production") {
    return {
      apiBaseUrl: "https://khalti.com/api/v2",
      checkoutBaseUrl: "https://pay.khalti.com",
    };
  }

  return {
    apiBaseUrl: "https://dev.khalti.com/api/v2",
    checkoutBaseUrl: "https://test-pay.khalti.com",
  };
}

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

    const purchaseOrderId = createPurchaseOrderId(customer.id, account.id, amount);
    const siteUrl = getSiteUrl(req);
    const khaltiConfig = getKhaltiConfig();

    const khaltiRes = await fetch(`${khaltiConfig.apiBaseUrl}/epayment/initiate/`, {
      method: "POST",
      headers: {
        Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        return_url: `${siteUrl}/api/customer-auth/khalti-verify`,
        website_url: siteUrl,
        amount: Number(amount) * 100,
        purchase_order_id: purchaseOrderId,
        purchase_order_name: "Due Payment",
        customer_info: {
          name: customer.name || "Customer",
        },
      }),
    });

    const khaltiData = await khaltiRes.json();
    console.log("Khalti response:", khaltiData);

    if (!khaltiData.payment_url && !khaltiData.pidx) {
      return NextResponse.json(
        { message: khaltiData?.detail || "Khalti initiation failed" },
        { status: 400 }
      );
    }

    const paymentUrl = khaltiData.payment_url || `${khaltiConfig.checkoutBaseUrl}/?pidx=${khaltiData.pidx}`;
    const normalizedPaymentUrl = khaltiData.pidx
      ? `${khaltiConfig.checkoutBaseUrl}/?pidx=${khaltiData.pidx}`
      : paymentUrl;

    return NextResponse.json({
      payment_url: normalizedPaymentUrl,
      pidx: khaltiData.pidx,
      purchase_order_id: purchaseOrderId,
    });
  } catch (err) {
    console.error("Khalti initiate error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
