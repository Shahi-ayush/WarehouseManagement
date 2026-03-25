import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { customerId, amount, method, reference } = body;

    if (!customerId || !amount || !method) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    // Check if customer exists
    const customer = await db.customer.findUnique({
      where: { id: customerId }
    });

    if (!customer) {
      return NextResponse.json({ message: "Customer not found" }, { status: 404 });
    }

    // Create payment
    const payment = await db.payment.create({
      data: {
        customerId,
        amount: Number(amount),
        method, // CASH or BANK
        reference: reference || null,
        userId,
      },
    });

    return NextResponse.json(payment, { status: 201 });

  } catch (error) {
    console.error("Payment error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

