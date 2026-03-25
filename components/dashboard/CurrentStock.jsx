import DataTable from '@/components/dashboard/DataTable';
// import db from '@/lib/db';
import { db } from "@/lib/db";

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

export default async function CurrentStock() {
  // ✅ Get the logged-in user
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) {
    return <p className="text-red-500 p-4">Unauthorized. Please login to see stock.</p>;
  }

  // ✅ Fetch items with relations
  const items = await db.item.findMany({
    where: { userId },
    include: {
      category: true,
      warehouse: true,
    },
  });

  const columns = ["imageUrl", "title", "quantity", "category.title", "warehouse.title"];

  return (
    <div className="p-8 bg-[url('/path-to-header-bg.jpg')] bg-cover bg-center">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        Available Stock Items
      </h2>

      <div className="my-4 p-4 bg-white rounded-xl shadow">
        <DataTable data={items} columns={columns} resourceTitle="items" />
      </div>
    </div>
  );
}
