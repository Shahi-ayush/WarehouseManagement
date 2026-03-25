// import db from "@/lib/db";
import { db } from "@/lib/db";

import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split("/").pop(); // get last segment
    const unit = await db.unit.findUnique({ where: { id } });
    return NextResponse.json(unit);
  } catch (error) {
    return NextResponse.json({ message: "Failed to fetch unit", error }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split("/").pop();
    const {
        title,
       abbreviation
      } = await request.json();
    const unit = await db.unit.update({
      where: { id },
      data: { 
        title,
        abbreviation
       },
    });
    return NextResponse.json(unit);
  } catch (error) {
    return NextResponse.json({ message: "Failed to update unit", error }, { status: 500 });
  }
}
