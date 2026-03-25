// import db from "@/lib/db";
import { db } from "@/lib/db";

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

// 🟢 CREATE ITEM (POST)
export async function POST(request) {
  try {
    const itemData = await request.json();

    // ✅ Get logged-in user
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // ✅ Get warehouse and update stock
    const warehouse = await db.warehouse.findUnique({
      where: { id: itemData.warehouseId },
    });

    if (!warehouse) {
      return NextResponse.json({ message: "Warehouse not found" }, { status: 404 });
    }

    const newStockQty = parseInt(warehouse.stockQty) + parseInt(itemData.qty);

    await db.warehouse.update({
      where: { id: itemData.warehouseId },
      data: { stockQty: newStockQty },
    });

    // ✅ Create item linked to user
    const item = await db.item.create({
      data: {
        title: itemData.title,
        categoryId: itemData.categoryId,
        sku: itemData.sku,
        barcode: itemData.barcode,
        quantity: parseInt(itemData.qty),
        // unitId: itemData.unitId,
        brandId: itemData.brandId,
        supplierId: itemData.supplierId,
        buyingPrice: parseFloat(itemData.buyingPrice),
        sellingPrice: parseFloat(itemData.sellingPrice),
        // reOrderPoint: parseInt(itemData.reOrderPoint),
        warehouseId: itemData.warehouseId,
        imageUrl: itemData.imageUrl,
        weight: parseFloat(itemData.weight),
        dimensions: itemData.dimensions,
        // taxRate: parseFloat(itemData.taxRate),
        description: itemData.description,
        notes: itemData.notes,
        userId: session.user.id, // link to logged-in user
      },
    });

    return NextResponse.json(item);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Failed to create item", error },
      { status: 500 }
    );
  }
}

// 🟡 GET ALL ITEMS (GET)
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const items = await db.item.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      include: {
        category: true,
        warehouse: true,
        brand: true,
      },
    });

    return NextResponse.json(items);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Failed to fetch items", error },
      { status: 500 }
    );
  }
}

// 🔴 DELETE ITEM (DELETE)
export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const id = request.nextUrl.searchParams.get("id");

    // ✅ Ensure the item belongs to the logged-in user
    const item = await db.item.findUnique({ where: { id } });
    if (!item || item.userId !== session.user.id) {
      return NextResponse.json({ message: "Not authorized" }, { status: 403 });
    }

    const deletedItem = await db.item.delete({ where: { id } });

    return NextResponse.json(deletedItem);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Failed to delete item", error },
      { status: 500 }
    );
  }
}



// import db from "@/lib/db";
// import { Warehouse } from "lucide-react";
// import { NextResponse } from "next/server";

// export async function POST(request) {

//     try{

//   const itemData =await request.json();
//    //get the warehouse
// const warehouse = await db.warehouse.findUnique(

//   {
// where: {
//   id:itemData.warehouseId,
// }
//   })
// //current stock of the warehouse
// const currentWarehouseStock = warehouse.stockQty;
// const newStockQty = parseInt(currentWarehouseStock)+ parseInt(itemData.qty)
//   //update the stock on the warehouse
// const updatedWarehouse =await db.warehouse.update({
//   where:{
//     id:itemData.warehouseId,
//   },
//   data:{
// stockQty:newStockQty
//   }
// })
// const item = await db.item.create({

// data:{

//     title:itemData.title,
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


// }


// })
 
//      return NextResponse.json(item);
//     }
//   catch(error){
//     console.log(error);
//     return NextResponse.json({
//         error,
//         message:"Failed to create a Item"
//     }
//     ,{
//         status:500,
//     })
//   }
    
// }
    
// export async function GET(request) {
//   try {

// const items =await db.item.findMany({
// orderBy:{
//   createdAt: 'desc' //latest warehouse
// },
// include:{
//   category:true,
//   warehouse:true,
//   brand:true
// },
// })

// return NextResponse.json(items);
    
//   } catch (error) {
//      console.log(error);
//     return NextResponse.json({
//         error,
//         message:"Failed to fetch the items"
//     }
//     ,{
//         status:500,
//     }
//   )
//   }
// }


// export async function DELETE(request) {
//   try {
//     const id = request.nextUrl.searchParams.get("id")
//     const deletedItem=await db.item.delete({
//       where:{
//         id
//       },
//     })

    
//     return NextResponse.json(deletedItem)
    
//    } 
//    catch (error) {
//     console.log(error)
//      return NextResponse.json({
//         error,
//         message:"Failed to delete item"
//     }
//     ,{
//         status:500,
//     }
//   )

// }
// }
