
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { NextResponse } from "next/server";

// ✅ Create new customer
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { name, phone, email, address } = await request.json();

    if (!name || !phone)
      return NextResponse.json({ message: "Name and phone are required" }, { status: 400 });

    const existing = await db.customer.findFirst({ where: { phone, userId } });
    if (existing)
      return NextResponse.json({ message: "Customer already exists", customer: existing }, { status: 400 });

    const newCustomer = await db.customer.create({
      data: { name, phone, email, address, userId },
    });

    return NextResponse.json({ customer: newCustomer });
  } catch (error) {
    console.error("Error creating customer:", error);
    return NextResponse.json({ error: "Failed to create customer" }, { status: 500 });
  }
}

// ✅ Get all customers or single by phone
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const phone = searchParams.get("phone");

    if (phone) {
      const customer = await db.customer.findFirst({ where: { phone, userId }, include: { sales: true } });
      return NextResponse.json({ customer });
    }

    const customers = await db.customer.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ customers });
  } catch (error) {
    console.error("Error fetching customers:", error);
    return NextResponse.json({ error: "Failed to fetch customers" }, { status: 500 });
  }
}
