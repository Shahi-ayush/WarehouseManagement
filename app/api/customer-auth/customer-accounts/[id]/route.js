// /api/admin/customer-accounts/[id]/dismiss/route.js
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PATCH(req, { params }) {
  const { id } = params;

  await db.customerAccount.update({
    where: { id },
    data: { status: "dismissed" },
  });

  return NextResponse.json({ success: true });
}
