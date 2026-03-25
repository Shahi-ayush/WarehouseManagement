// app/(back-office)/dashboard/inventory/adjustments/page.jsx
import DataTable from '@/components/dashboard/DataTable'
import FixedHeader from '@/components/dashboard/FixedHeader'
// import db from '@/lib/db'
import { db } from "@/lib/db";

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'

export default async function Adjustments() {
  // ✅ Get current session
  const session = await getServerSession(authOptions)
  const userId = session?.user?.id

  if (!userId) {
    return (
      <div className="p-8">
        <FixedHeader title="Adjustments" newLink="/dashboard/inventory/adjustments/new" />
        <p className="text-red-500">Unauthorized. Please login to view adjustments.</p>
      </div>
    )
  }

  // ✅ Fetch user-specific adjustments directly from DB
  const [addAdjustments, transferAdjustments] = await Promise.all([
    db.addStockAdjustment.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    }),
    db.transferStockAdjustment.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    }),
  ])

  // ✅ Define table columns
  const addColumns = ['referenceNumber', 'addStockQty', 'createdAt']
  const transferColumns = ['referenceNumber', 'transferStockQty', 'createdAt']

  return (
    <div>
      <FixedHeader title="Adjustments" newLink="/dashboard/inventory/adjustments/new" />

      <div className="my-4 p-8">
        <h2 className="py-4 text-xl font-semibold">Stock Increment Adjustments</h2>
        <DataTable
          data={addAdjustments.length ? addAdjustments : []}
          columns={addColumns}
          resourceTitle="adjustments/add"
        />
        {addAdjustments.length === 0 && <p className="text-gray-500 mt-2">No stock additions yet.</p>}
      </div>

      <div className="my-4 p-8">
        <h2 className="py-4 text-xl font-semibold">Transfer Stock Adjustments</h2>
        <DataTable
          data={transferAdjustments.length ? transferAdjustments : []}
          columns={transferColumns}
          resourceTitle="adjustments/transfer"
        />
        {transferAdjustments.length === 0 && <p className="text-gray-500 mt-2">No stock transfers yet.</p>}
      </div>
    </div>
  )
}
