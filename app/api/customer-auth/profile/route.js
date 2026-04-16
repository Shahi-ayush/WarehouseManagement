import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyCustomerToken } from "@/lib/auth";
import bcrypt from "bcrypt";

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

    return NextResponse.json({
      account: {
        email: account.email,
        phone: account.phone,
        status: account.status,
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
 * (name, address, and optional password)
 */
export async function PUT(req) {
  try {
    const decoded = verifyCustomerToken(req);
    const body = await req.json();

    const { name, address, currentPassword, newPassword } = body;

    if (!name || !address) {
      return NextResponse.json(
        { error: "Name and address are required" },
        { status: 400 }
      );
    }

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

    const isPasswordUpdateRequested = Boolean(currentPassword || newPassword);

    if (isPasswordUpdateRequested) {
      if (!currentPassword) {
        return NextResponse.json(
          { error: "Current password is required to update password" },
          { status: 400 }
        );
      }

      const isPasswordValid = await bcrypt.compare(
        currentPassword,
        account.password
      );

      if (!isPasswordValid) {
        return NextResponse.json(
          { error: "Current password is incorrect" },
          { status: 401 }
        );
      }
    }

    await db.customer.update({
      where: { id: account.customer.id },
      data: {
        name,
        address,
      },
    });

    if (newPassword) {
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await db.customerAccount.update({
        where: { id: account.id },
        data: {
          password: hashedPassword,
        },
      });
    }

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

/**
 * DELETE — Delete logged-in customer's account and profile
 */
export async function DELETE(req) {
  try {
    const decoded = verifyCustomerToken(req);
    const body = await req.json();
    const { currentPassword } = body;

    if (!currentPassword) {
      return NextResponse.json(
        { error: "Current password is required" },
        { status: 400 }
      );
    }

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

    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      account.password
    );

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Current password is incorrect" },
        { status: 401 }
      );
    }

    if (account.customer) {
      await db.customer.delete({
        where: { id: account.customer.id },
      });
    }

    await db.customerAccount.delete({
      where: { id: account.id },
    });

    return NextResponse.json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }
}