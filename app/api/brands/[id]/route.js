// import db from "@/lib/db";
import { db } from "@/lib/db";

import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split("/").pop(); // get last segment
    const brand = await db.brand.findUnique({ where: { id } });
    return NextResponse.json(brand);
  } catch (error) {
    return NextResponse.json({ message: "Failed to fetch brand", error }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split("/").pop();
    const {
        title
        } = await request.json();
    const brand = await db.brand.update({
      where: { id },
      data: { 
        title
         },
    });
    return NextResponse.json(brand);
  } catch (error) {
    return NextResponse.json({ message: "Failed to update brand", error }, { status: 500 });
  }
}
