import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req) {
  try {
    const { saleId, status } = await req.json();

    if (!saleId || !status) {
      return NextResponse.json({ error: "Missing saleId or status" }, { status: 400 });
    }

    const updatedSale = await prisma.sale.update({
      where: { id: saleId },
      data: { status },
    });

    return NextResponse.json({ sale: updatedSale });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}