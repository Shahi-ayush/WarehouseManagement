
import CurrentStock from '@/components/dashboard/CurrentStock';
import DashboardBanner from '@/components/dashboard/DashboardBanner';
import SalesOverview from '@/components/dashboard/SalesOverview';
import UnverifiedToastNotifier from '@/components/dashboard/UnverifiedToastNotifier';
import LowStockNotifier from '@/components/dashboard/LowStockNotifier';
import { db } from "@/lib/db";

export const dynamic = 'force-dynamic'; 
export const revalidate = 60;

export default async function Dashboard() {
  const items = await db.item.findMany({
    orderBy: { createdAt: "desc" },
  });

  // 🔹 Filter low stock items
  const lowStockItems = items.filter(
    (item) => item.quantity > 0 && item.quantity <= (item.reOrderPoint || 5)
  );

  return (
    <div>
      <UnverifiedToastNotifier />
      {/* <DashboardBanner /> */}

      {/* 🔹 Low stock toast notification */}
      {/* <LowStockNotifier lowStockItems={lowStockItems} /> */}

      <SalesOverview />
      <CurrentStock items={items} />
    </div>
  );
}