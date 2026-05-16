// import db from "@/lib/db";
import { db } from "@/lib/db";

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

function isUniqueConstraintError(error) {
  return error?.code === "P2002";
}

function parseWishlistRequests(raw) {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};

  const parsed = {};
  for (const [itemId, qty] of Object.entries(raw)) {
    const quantity = Number.parseInt(qty, 10);
    if (Number.isFinite(quantity) && quantity > 0) {
      parsed[itemId] = quantity;
    }
  }

  return parsed;
}

// 🟢 CREATE ITEM (POST)
export async function POST(request) {
  try {
    const itemData = await request.json();
    const sku = itemData.sku?.trim();
    const quantity = parseInt(itemData.qty);

    // ✅ Get logged-in user
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (!sku || !itemData.warehouseId) {
      return NextResponse.json(
        { message: "SKU and warehouse are required" },
        { status: 400 }
      );
    }

    if (!Number.isInteger(quantity) || quantity < 0) {
      return NextResponse.json(
        { message: "Item Quantity cannot be negative" },
        { status: 400 }
      );
    }

    // ✅ Get warehouse and update stock
    const warehouse = await db.warehouse.findUnique({
      where: { id: itemData.warehouseId },
    });

    if (!warehouse) {
      return NextResponse.json({ message: "Warehouse not found" }, { status: 404 });
    }

    if (warehouse.userId !== session.user.id) {
      return NextResponse.json({ message: "Not authorized" }, { status: 403 });
    }

    const duplicateItem = await db.item.findFirst({
      where: {
        sku,
        warehouseId: itemData.warehouseId,
        userId: session.user.id,
      },
      select: { id: true },
    });

    if (duplicateItem) {
      return NextResponse.json(
        { message: "An item with this SKU already exists in the selected warehouse" },
        { status: 409 }
      );
    }

    const newStockQty = parseInt(warehouse.stockQty) + quantity;

    await db.warehouse.update({
      where: { id: itemData.warehouseId },
      data: { stockQty: newStockQty },
    });

    // ✅ Create item linked to user
    const item = await db.item.create({
      data: {
        title: itemData.title,
        categoryId: itemData.categoryId,
        sku,
        barcode: itemData.barcode,
        quantity,
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
    if (isUniqueConstraintError(error)) {
      return NextResponse.json(
        { message: "An item with this SKU already exists in the selected warehouse" },
        { status: 409 }
      );
    }

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
        supplier: true,
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

    if (item.quantity !== 0) {
      return NextResponse.json(
        { message: "Item cannot be deleted while quantity is greater than 0." },
        { status: 400 }
      );
    }

    const customers = await db.customer.findMany({
      where: { userId: session.user.id },
      select: {
        wishlist: true,
        purchasedItems: true,
      },
    });

    const isItemInWishlist = customers.some((customer) => {
      if ((customer.wishlist || []).includes(id)) return true;

      const requestedItems = parseWishlistRequests(customer.purchasedItems);
      return (requestedItems[id] || 0) > 0;
    });

    if (isItemInWishlist) {
      return NextResponse.json(
        {
          message:
            "Item cannot be deleted because it is still present in a customer wishlist.",
        },
        { status: 400 }
      );
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
