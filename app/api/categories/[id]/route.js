// import db from "@/lib/db";
import { db } from "@/lib/db";

import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split("/").pop(); // get last segment
    const category = await db.category.findUnique({ where: { id } });
    return NextResponse.json(category);
  } catch (error) {
    return NextResponse.json({ message: "Failed to fetch category", error }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split("/").pop();
    const { title, description } = await request.json();
    const category = await db.category.update({
      where: { id },
      data: { title, description },
    });
    return NextResponse.json(category);
  } catch (error) {
    return NextResponse.json({ message: "Failed to update category", error }, { status: 500 });
  }
}
