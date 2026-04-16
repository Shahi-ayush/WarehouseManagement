import { db } from "@/lib/db";
import { NextResponse } from "next/server";

function parsePurchaseOrderId(purchaseOrderId) {
  const [prefix, customerId, accountId, amount] = (purchaseOrderId || "").split("__");

  if (prefix !== "due" || !customerId || !accountId || !amount) {
    return null;
  }

  return {
    customerId,
    accountId,
    amount: Number(amount),
  };
}

function getSiteUrl(req) {
  return new URL(req.url).origin;
}

function getKhaltiApiBaseUrl() {
  return (process.env.KHALTI_ENV || "sandbox").toLowerCase() === "production"
    ? "https://khalti.com/api/v2"
    : "https://dev.khalti.com/api/v2";
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const siteUrl = getSiteUrl(req);

    const pidx = searchParams.get("pidx");
    const status = searchParams.get("status");
    const purchaseOrderId = searchParams.get("purchase_order_id");

    if (status !== "Completed") {
      return NextResponse.redirect(
        `${siteUrl}/customer/payment?status=failed`
      );
    }

    const verifyRes = await fetch(`${getKhaltiApiBaseUrl()}/epayment/lookup/`, {
      method: "POST",
      headers: {
        Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ pidx }),
    });

    const verifyData = await verifyRes.json();
    console.log("Khalti lookup response:", verifyData);

    if (verifyData.status !== "Completed") {
      return NextResponse.redirect(
        `${siteUrl}/customer/payment?status=failed`
      );
    }

    const parsedOrder = parsePurchaseOrderId(purchaseOrderId);
    if (!parsedOrder) {
      return NextResponse.redirect(
        `${siteUrl}/customer/payment?status=error`
      );
    }

    const account = await db.customerAccount.findUnique({
      where: { id: parsedOrder.accountId },
    });

    const customer = await db.customer.findUnique({
      where: { id: parsedOrder.customerId },
      include: { payments: true, sales: true },
    });

    if (!account || !customer || account.customerId !== customer.id) {
      return NextResponse.redirect(
        `${siteUrl}/customer/payment?status=error`
      );
    }

    const existingPayment = await db.payment.findFirst({
      where: { reference: pidx },
    });

    if (!existingPayment) {
      const totalSales = customer.sales.reduce((sum, sale) => sum + sale.total, 0);
      const totalPaid = customer.payments.reduce((sum, payment) => sum + payment.amount, 0);
      const balance = totalSales - totalPaid;
      const verifiedAmount = Number(verifyData.total_amount || 0) / 100;
      const amountToRecord = Math.min(parsedOrder.amount, verifiedAmount, balance);

      if (!(amountToRecord > 0)) {
        return NextResponse.redirect(
          `${siteUrl}/customer/payment?status=failed`
        );
      }

      await db.payment.create({
        data: {
          customerId: customer.id,
          userId: customer.userId,
          amount: amountToRecord,
          method: "KHALTI",
          reference: pidx,
        },
      });
    }

    return NextResponse.redirect(
      `${siteUrl}/customer/dashboard?status=success`
    );
  } catch (err) {
    console.error("Khalti verify error:", err);
    return NextResponse.redirect(
      `${getSiteUrl(req)}/customer/payment?status=error`
    );
  }
}
