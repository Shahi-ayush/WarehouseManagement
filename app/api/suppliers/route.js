
// import db from "@/lib/db";
import { db } from "@/lib/db";

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

// 🟢 CREATE supplier (POST)
export async function POST(request) {
  try {
    const { 
    title,
    phone,
    email,
    address,
    contactPerson,
    supplierCode,
    taxID,
    paymentTerms,
    notes
   } = await request.json();

    // ✅ Get logged-in user from session
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // ✅ Create supplier linked to this user
    const supplier = await db.supplier.create({
      data: {
        title,
        phone,
        email,
        address,
        contactPerson,
        supplierCode,
        taxID,
        paymentTerms,
        notes,
        userId: session.user.id,
      },
    });

    console.log("Created supplier:", supplier);
    return NextResponse.json(supplier);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Failed to create supplier", error },
      { status: 500 }
    );
  }
}

// 🟡 GET ALL supplier (GET)
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // ✅ Fetch only the user's supplier
    const suppliers = await db.supplier.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(suppliers);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Failed to fetch supplier", error },
      { status: 500 }
    );
  }
}

// 🔴 DELETE supplier (DELETE)
export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const id = request.nextUrl.searchParams.get("id");

    // ✅ Ensure the category belongs to the logged-in user
    const supplier = await db.supplier.findUnique({ where: { id } });
    if (!supplier || supplier.userId !== session.user.id) {
      return NextResponse.json({ message: "Not authorized" }, { status: 403 });
    }

    const deletedSupplier = await db.supplier.delete({ where: { id } });
    console.log("Deleted supplier:", deletedSupplier);

    return NextResponse.json(deletedSupplier);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Failed to delete supplier", error },
      { status: 500 }
    );
  }
}
