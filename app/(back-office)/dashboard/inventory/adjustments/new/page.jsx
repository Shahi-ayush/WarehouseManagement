
// //import { Value } from 'sass'
// import AdjustmentForm from '@/components/dashboard/AdjustmentForm'
// import { getData } from '@/lib/getData'
// export default async function NewAdjustments() {

// const itemsData = getData("items")
// const warehousesData =  getData("warehouse")
// const suppliersData= getData("suppliers")


// const[items,warehouses,suppliers]=await Promise.all([itemsData,warehousesData,suppliersData])

//   return (
//    <AdjustmentForm items={items} warehouses={warehouses} suppliers={suppliers}/>
//   )
// }

// app/(back-office)/dashboard/inventory/adjustments/new/page.jsx

import AdjustmentForm from '@/components/dashboard/AdjustmentForm';
import { authOptions } from '@/lib/authOptions';
// import db from '@/lib/db';
import { db } from "@/lib/db";


import { getServerSession } from 'next-auth';

export default async function NewAdjustments() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) return <p>Unauthorized</p>;

  // Fetch user-specific data
  const [items, warehouses, suppliers] = await Promise.all([
    db.item.findMany({ where: { userId } }),
    db.warehouse.findMany({ where: { userId } }),
    db.supplier.findMany({ where: { userId } }),
  ]);

  return <AdjustmentForm items={items} warehouses={warehouses} suppliers={suppliers} />;
}
