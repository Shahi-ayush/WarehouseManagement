import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const accounts = await db.customerAccount.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      customer: true,
    },
  });

  return NextResponse.json({ accounts });
}

