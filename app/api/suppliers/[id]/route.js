// import db from "@/lib/db";
import { db } from "@/lib/db";

import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split("/").pop(); // get last segment
    const supplier = await db.supplier.findUnique({ where: { id } });
    return NextResponse.json(supplier);
  } catch (error) {
    return NextResponse.json({ message: "Failed to fetch supplier", error }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split("/").pop();
    const {
        title,
        phone,
        email,
        address,
        contactPerson,
        supplierCode,
        taxID,
        paymentTerms,
        notes } = await request.json();
    const supplier = await db.supplier.update({
      where: { id },
      data: { 
        title,
        phone,
        email,
        address,
        contactPerson,
        supplierCode,
        taxID,
        paymentTerms,
        notes, },
    });
    return NextResponse.json(supplier);
  } catch (error) {
    return NextResponse.json({ message: "Failed to update supplier", error }, { status: 500 });
  }
}
