


import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyCustomerToken } from "@/lib/auth";

/**
 * GET — Fetch logged-in customer's profile
 */
export async function GET(req) {
  try {
    const decoded = verifyCustomerToken(req);

    const account = await db.customerAccount.findUnique({
      where: { id: decoded.accountId },
      include: { customer: true },
    });

    if (!account) {
      return NextResponse.json(
        { error: "Account not found" },
        { status: 404 }
      );
    }

    // return NextResponse.json({
    //   account: {
    //     email: account.email,
    //     phone: account.phone,
    //   },
    //   customer: account.customer
    //     ? {
    //         id: account.customer.id,
    //         name: account.customer.name,
    //         address: account.customer.address,
    //       }
    //     : null,
    // });
return NextResponse.json({
  account: {
    email: account.email,
    phone: account.phone,
    status: account.status, // <-- return status here
  },
  customer: account.customer
    ? {
        id: account.customer.id,
        name: account.customer.name,
        address: account.customer.address,
      }
    : null,
});


  } catch {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }
}

/**
 * PUT — Update logged-in customer's profile
 * (name & address ONLY)
 */
export async function PUT(req) {
  try {
    const decoded = verifyCustomerToken(req);
    const body = await req.json();

    const { name, address } = body;

    const account = await db.customerAccount.findUnique({
      where: { id: decoded.accountId },
      include: { customer: true },
    });

    if (!account?.customer) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      );
    }

    await db.customer.update({
      where: { id: account.customer.id },
      data: {
        name,
        address,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
    });
  } catch {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }
}
