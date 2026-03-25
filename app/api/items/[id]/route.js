// import db from "@/lib/db";
import { db } from "@/lib/db";

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

// 🟡 GET ITEM BY ID
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(request.url);
    const id = url.pathname.split("/").pop(); // get last segment (item ID)

    const item = await db.item.findUnique({
      where: { id },
      include: { warehouse: true, category: true, brand: true },
    });

    if (!item || item.userId !== session.user.id) {
      return NextResponse.json({ message: "Not authorized" }, { status: 403 });
    }

    return NextResponse.json(item);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Failed to fetch the item", error },
      { status: 500 }
    );
  }
}

// 🟢 UPDATE ITEM BY ID
export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(request.url);
    const id = url.pathname.split("/").pop(); // get last segment (item ID)

    const existingItem = await db.item.findUnique({ where: { id } });
    if (!existingItem || existingItem.userId !== session.user.id) {
      return NextResponse.json({ message: "Not authorized" }, { status: 403 });
    }

    const itemData = await request.json();

    const updatedItem = await db.item.update({
      where: { id },
      data: {
        title: itemData.title,
        categoryId: itemData.categoryId,
        sku: itemData.sku,
        // barcode: itemData.barcode,
        quantity: parseInt(itemData.qty),
        unitId: itemData.unitId,
        brandId: itemData.brandId,
        supplierId: itemData.supplierId,
        buyingPrice: parseFloat(itemData.buyingPrice),
        sellingPrice: parseFloat(itemData.sellingPrice),
        // reOrderPoint: parseInt(itemData.reOrderPoint),
        warehouseId: itemData.warehouseId,
        imageUrl: itemData.imageUrl,
        // weight: parseFloat(itemData.weight),
        dimensions: itemData.dimensions,
        // taxRate: parseFloat(itemData.taxRate),
        description: itemData.description,
        // notes: itemData.notes,
      },
    });

    return NextResponse.json(updatedItem);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Failed to update the item", error },
      { status: 500 }
    );
  }
}



// import db from "@/lib/db";
// import { Warehouse } from "lucide-react";
// import { NextResponse } from "next/server";


// export async function GET(request,{params:{id}}) {
//   try {

// const item =await db.item.findUnique({
// where:{
//   id
// },
// include:{
//   warehouse:true,
  
// }
// })

// return NextResponse.json(item);
    
//   } catch (error) {
//      console.log(error);
//     return NextResponse.json({
//         error,
//         message:"Failed to fetch the item"
//     }
//     ,{
//         status:500,
//     }
//   )
//   }
// }




// export async function PUT(request,{params:{id}}) {

  
//   try {
// const itemData = await request.json()
// const item =await db.item.update({
// where:{
//   id,
// },
// data:{
//      title:itemData.title,
//     categoryId:itemData.categoryId,
//     sku:itemData.sku,
//     barcode:itemData.barcode,
//     quantity:parseInt(itemData.qty),
//     unitId:itemData.unitId,
//     brandId:itemData.brandId,
//     supplierId:itemData.supplierId,
//     buyingPrice:parseFloat(itemData.buyingPrice),
//     sellingPrice:parseFloat(itemData.sellingPrice),
//     reOrderPoint:parseInt(itemData.reOrderPoint),
//     warehouseId:itemData.warehouseId,
//     imageUrl:itemData.imageUrl,
//     weight:parseFloat(itemData.weight),
//     dimensions:itemData.dimensions,
//     taxRate:parseFloat(itemData.taxRate),
//     description:itemData.description,
//     notes:itemData.notes,
  
// },

// })
// console.log(item)

// return NextResponse.json(item);
    
//   } catch (error) {
//      console.log(error);
//     return NextResponse.json({
//         error,
//         message:"Failed to Update the item"
//     }
//     ,{
//         status:500,
//     }
//   )
//   }
// }

