import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id; // logged-in user ID
    const { amount, method, reference } = await req.json();

    if (!amount || !method) {
      return NextResponse.json({ message: "Amount and method required" }, { status: 400 });
    }

    // ✅ normalize method to uppercase (Prisma enum)
    const methodEnum = method.toUpperCase();
    const validMethods = ["CASH", "BANK"];
    if (!validMethods.includes(methodEnum)) {
      return NextResponse.json({ message: "Invalid payment method" }, { status: 400 });
    }

    // ✅ Find customer by session userId
    const customer = await db.customer.findFirst({
      where: { userId },
      include: { payments: true, sales: true },
    });

    if (!customer) {
      return NextResponse.json({ message: "Customer not found" }, { status: 404 });
    }

    // ✅ Calculate remaining due
    const totalSales = customer.sales.reduce((sum, s) => sum + s.total, 0);
    const totalPaid = customer.payments.reduce((sum, p) => sum + p.amount, 0);
    const balance = totalSales - totalPaid;

    if (Number(amount) > balance) {
      return NextResponse.json({ message: "Amount exceeds due balance" }, { status: 400 });
    }

    // ✅ Create payment
    const payment = await db.payment.create({
      data: {
        customerId: customer.id,
        userId,          // logged-in user
        amount: Number(amount),
        method: methodEnum,
        reference: reference || "",
      },
    });

    return NextResponse.json({ success: true, payment });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}