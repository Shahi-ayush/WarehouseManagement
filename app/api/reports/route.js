// import db from "@/lib/db";
// import { NextResponse } from "next/server";

// export async function GET() {
//   try {
//     // Fetch latest 5 records from all collections
//     const [items, categories, brands, suppliers, addStock, transferStock] =
//       await Promise.all([
//         db.item.findMany({
//           orderBy: { createdAt: "desc" },
//           take: 5,
//         }),
//         db.category.findMany({
//           orderBy: { createdAt: "desc" },
//           take: 5,
//         }),
//         db.brand.findMany({
//           orderBy: { createdAt: "desc" },
//           take: 5,
//         }),
//         db.supplier.findMany({
//           orderBy: { createdAt: "desc" },
//           take: 5,
//         }),
//         db.addStockAdjustment.findMany({
//           orderBy: { createdAt: "desc" },
//           take: 5,
//           include: {
//             item: { select: { title: true } },
//             receivingWarehouse: { select: { title: true } },
//           },
//         }),
//         db.transferStockAdjustment.findMany({
//           orderBy: { createdAt: "desc" },
//           take: 5,
//           include: {
//             item: { select: { title: true } },
//             givingWarehouse: { select: { title: true } },
//             receivingWarehouse: { select: { title: true } },
//           },
//         }),
//       ]);

//     const activities = [];

//     // --- Base creation logs ---
//     const entityGroups = [
//       { data: items, label: "Item" },
//       { data: categories, label: "Category" },
//       { data: brands, label: "Brand" },
//       { data: suppliers, label: "Supplier" },
//     ];

//     entityGroups.forEach(({ data, label }) => {
//       data.forEach((entry) =>
//         activities.push({
//           id: entry.id,
//           type: `${label} Created`,
//           message: `${label} "${entry.title}" was created.`,
//           createdAt: entry.createdAt,
//         })
//       );
//     });

//     // --- Add Stock logs ---
//     addStock.forEach((a) => {
//       activities.push({
//         id: a.id,
//         type: "Stock Added",
//         message: `Added ${a.addStockQty} units of "${a.item?.title ?? "Unknown Item"}" to "${a.receivingWarehouse?.title ?? "Unknown Warehouse"}".`,
//         createdAt: a.createdAt,
//       });
//     });

//     // --- Transfer Stock logs ---
//     transferStock.forEach((t) => {
//       activities.push({
//         id: t.id,
//         type: "Stock Transferred",
//         message: `Transferred ${t.transferStockQty} units of "${t.item?.title ?? "Unknown Item"}" from "${t.givingWarehouse?.title ?? "Unknown Warehouse"}" to "${t.receivingWarehouse?.title ?? "Unknown Warehouse"}".`,
//         createdAt: t.createdAt,
       
//       });
//      console.log(givingWarehouse.title)
//     });

//     // --- Sort all activities by latest ---
//     activities.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

//     return NextResponse.json({ activities });
//   } catch (error) {
//     console.error("Error fetching recent activities:", error);
//     return NextResponse.json(
//       { error: "Failed to fetch recent activities" },
//       { status: 500 }
//     );
//   }
// }


// import db from "@/lib/db";
import { db } from "@/lib/db";

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    if (!userId) return NextResponse.json({ activities: [] }, { status: 401 });

    // Fetch only current user's data
    const [items, categories, brands, suppliers, addStock, transferStock, warehouses] =
      await Promise.all([
        db.item.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 5 }),
        db.category.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 5 }),
        db.brand.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 5 }),
        db.supplier.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 5 }),
        db.addStockAdjustment.findMany({
          where: { userId },
          orderBy: { createdAt: "desc" },
          take: 5,
          include: { item: { select: { title: true } }, receivingWarehouse: { select: { title: true } } },
        }),
        db.transferStockAdjustment.findMany({
          where: { userId },
          orderBy: { createdAt: "desc" },
          take: 5,
          include: {
            item: { select: { title: true } },
            givingWarehouse: { select: { title: true } },
            receivingWarehouse: { select: { title: true } },
          },
        }),
        db.warehouse.findMany({ where: { userId } }),
      ]);

    const activities = [];

    const entityGroups = [
      { data: items, label: "Item" },
      { data: categories, label: "Category" },
      { data: brands, label: "Brand" },
      { data: suppliers, label: "Supplier" },
    ];

    entityGroups.forEach(({ data, label }) => {
      data.forEach((entry) => {
        activities.push({
          id: `${label}:${entry.id}`,
          type: `${label} Created`,
          message: `${label} "${entry.title}" was created.`,
          createdAt: entry.createdAt,
        });
      });
    });

    addStock.forEach((a) => {
      activities.push({
        id: `add:${a.id}`,
        type: "Stock Added",
        message: `Added ${a.addStockQty} units of "${a.item?.title}" to "${a.receivingWarehouse?.title}"`,
        createdAt: a.createdAt,
      });
    });

    transferStock.forEach((t) => {
      activities.push({
        id: `transfer:${t.id}`,
        type: "Stock Transferred",
        message: `Transferred ${t.transferStockQty} units of "${t.item?.title}" from "${t.givingWarehouse?.title}" to "${t.receivingWarehouse?.title}"`,
        createdAt: t.createdAt,
      });
    });

    activities.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return NextResponse.json({ activities });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch recent activities" }, { status: 500 });
  }
}
