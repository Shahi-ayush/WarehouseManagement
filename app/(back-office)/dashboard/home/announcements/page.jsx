import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

function parseWishlistRequests(raw) {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
  const out = {};
  for (const [itemId, qty] of Object.entries(raw)) {
    const n = Number.parseInt(qty, 10);
    if (Number.isFinite(n) && n > 0) out[itemId] = n;
  }
  return out;
}

export default async function Announcements() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return <p className="p-4 text-sm text-red-600">Unauthorized</p>;
  }

  const customers = await db.customer.findMany({
    where: { userId: session.user.id },
    select: {
      id: true,
      name: true,
      phone: true,
      wishlist: true,
      purchasedItems: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const requestsByCustomer = customers.map((customer) => {
    const parsed = parseWishlistRequests(customer.purchasedItems);
    const merged = { ...parsed };
    for (const itemId of customer.wishlist || []) {
      if (!merged[itemId]) merged[itemId] = 1;
    }
    return { customer, requests: merged };
  });

  const itemIds = [
    ...new Set(
      requestsByCustomer.flatMap(({ requests }) => Object.keys(requests))
    ),
  ];

  const items = itemIds.length
    ? await db.item.findMany({
        where: { id: { in: itemIds }, userId: session.user.id },
        select: { id: true, title: true, sellingPrice: true, quantity: true },
      })
    : [];

  const itemMap = new Map(items.map((i) => [i.id, i]));

  const rows = requestsByCustomer.flatMap(({ customer, requests }) =>
    Object.entries(requests).map(([itemId, quantity]) => {
      const item = itemMap.get(itemId);
      return {
        customerId: customer.id,
        customerName: customer.name,
        phone: customer.phone,
        itemTitle: item?.title || `Unknown (${itemId})`,
        quantity,
        price: item?.sellingPrice || 0,
        stockQty: item?.quantity ?? 0,
      };
    })
  );

  return (
    <div className="space-y-5">
      <div className="rounded-xl border bg-gradient-to-r from-slate-50 to-white p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Dashboard Announcements
        </p>
        <h2 className="mt-1 text-2xl font-semibold text-slate-900">Customer Item Requests</h2>
        <p className="mt-1 text-sm text-slate-600">
          Requested quantities from customers with current remaining stock.
        </p>
      </div>

      {rows.length === 0 ? (
        <div className="rounded-xl border bg-white p-6 text-sm text-slate-500">
          No customer requests yet.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-slate-700">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Customer</th>
                <th className="px-4 py-3 text-left font-semibold">Phone</th>
                <th className="px-4 py-3 text-left font-semibold">Item</th>
                <th className="px-4 py-3 text-left font-semibold">Selected Qty</th>
                <th className="px-4 py-3 text-left font-semibold">Remaining Stock</th>
                <th className="px-4 py-3 text-left font-semibold">Unit Price</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => (
                <tr
                  key={`${row.customerId}-${row.itemTitle}-${idx}`}
                  className="border-t odd:bg-white even:bg-slate-50/50"
                >
                  <td className="px-4 py-3 font-medium text-slate-900">{row.customerName}</td>
                  <td className="px-4 py-3 text-slate-600">{row.phone}</td>
                  <td className="px-4 py-3 text-slate-700">{row.itemTitle}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700">
                      {row.quantity}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                        row.stockQty > row.quantity
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-rose-100 text-rose-700"
                      }`}
                    >
                      {row.stockQty}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-700">NPR {row.price.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
