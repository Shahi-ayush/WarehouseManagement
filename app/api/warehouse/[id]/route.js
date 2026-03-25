// import db from "@/lib/db";
import { db } from "@/lib/db";

import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split("/").pop(); // get last segment
    const warehouse = await db.warehouse.findUnique({ where: { id } });
    return NextResponse.json(warehouse);
  } catch (error) {
    return NextResponse.json({ message: "Failed to fetch warehouse", error }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split("/").pop();
    const {
       
    
 title,
    location,
    description,
  warehouseType:type,

    } = await request.json();
    const warehouse = await db.warehouse.update({
      where: { id },
      data: { 
       title,
    location,
    description,
  warehouseType:type,
      
      },
    });
    return NextResponse.json(warehouse);
  } catch (error) {
    return NextResponse.json({ message: "Failed to update warehouse", error }, { status: 500 });
  }
}
