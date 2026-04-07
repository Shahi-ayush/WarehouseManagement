

// "use client";
// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";

// // ── Sub-components ──────────────────────────────────────────

// function StatCard({ label, value, danger }) {
//   return (
//     <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
//       <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{label}</p>
//       <p className={`text-2xl font-medium ${danger ? "text-red-600 dark:text-red-400" : "text-gray-900 dark:text-gray-100"}`}>
//         NPR {value.toLocaleString()}
//       </p>
//     </div>
//   );
// }

// function MethodPill({ method }) {
//   const styles = {
//     CASH:   "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
//     BANK:   "bg-blue-100  text-blue-800  dark:bg-blue-900  dark:text-blue-300",
//     KHALTI: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300",
//     ESEWA:  "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
//   };
//   return (
//     <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${styles[method?.toUpperCase()] ?? "bg-gray-100 text-gray-600"}`}>
//       {method}
//     </span>
//   );
// }

// function StatusPill({ status }) {
//   const styles = {
//     paid:    "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
//     partial: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300",
//     due:     "bg-red-100   text-red-800   dark:bg-red-900   dark:text-red-300",
//   };
//   const labels = { paid: "Paid", partial: "Partial", due: "Due" };
//   return (
//     <span className={`text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap ${styles[status]}`}>
//       {labels[status]}
//     </span>
//   );
// }

// function BarChart({ purchases }) {
//   const monthly = purchases.reduce((acc, p) => {
//     const month = new Date(p.createdAt).toLocaleString("default", { month: "short" });
//     acc[month] = (acc[month] || 0) + p.total;
//     return acc;
//   }, {});
//   const entries = Object.entries(monthly);
//   const max = Math.max(...entries.map(([, v]) => v), 1);

//   if (entries.length === 0) {
//     return <p className="text-sm text-gray-400 py-4 text-center">No purchase data yet</p>;
//   }

//   return (
//     <div className="flex items-end gap-1.5 h-20">
//       {entries.map(([month, total], i) => (
//         <div key={month} className="flex flex-col items-center gap-1 flex-1">
//           <div
//             title={`NPR ${total.toLocaleString()}`}
//             style={{ height: `${Math.round((total / max) * 72)}px` }}
//             className={`w-full rounded-t transition-all ${
//               i === entries.length - 1
//                 ? "bg-blue-500 dark:bg-blue-400"
//                 : "bg-blue-200 dark:bg-blue-800"
//             }`}
//           />
//           <span className="text-[10px] text-gray-400">{month}</span>
//         </div>
//       ))}
//     </div>
//   );
// }

// function Card({ title, children }) {
//   return (
//     <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
//       {title && (
//         <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-3">
//           {title}
//         </p>
//       )}
//       {children}
//     </div>
//   );
// }

// // ── Main Dashboard ──────────────────────────────────────────

// export default function CustomerDashboard() {
//   const [profile, setProfile]     = useState(null);
//   const [dashboard, setDashboard] = useState({
//     totalSpent: 0, totalPaid: 0, dueBalance: 0,
//     recentPurchases: [], recentPayments: [],
//   });
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();

//   useEffect(() => {
//     const fetchData = async () => {
//       const token = localStorage.getItem("token");
//       if (!token) { router.push("/customer/login"); return; }
//       const headers = { Authorization: `Bearer ${token}` };
//       try {
//         const [profileRes, dashboardRes] = await Promise.all([
//           fetch("/api/customer-auth/profile",   { headers }).then((r) => r.json()),
//           fetch("/api/customer-auth/dashboard",  { headers }).then((r) => r.json()),
//         ]);
//         setProfile(profileRes);
//         setDashboard({
//           totalSpent:       dashboardRes.totalSpent       || 0,
//           totalPaid:        dashboardRes.totalPaid        || 0,
//           dueBalance:       dashboardRes.dueBalance       || 0,
//           recentPurchases:  dashboardRes.recentPurchases  || [],
//           recentPayments:   dashboardRes.recentPayments   || [],
//         });
//       } catch {
//         router.push("/customer/login");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//     const interval = setInterval(fetchData, 10000);
//     return () => clearInterval(interval);
//   }, [router]);

//   const logout = () => {
//     localStorage.removeItem("token");
//     router.push("/customer/login");
//   };

//   const initials = (name) =>
//     name ? name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase() : "??";

//   const getPurchaseStatus = (purchase) => {
//     if (dashboard.totalPaid >= dashboard.totalSpent) return "paid";
//     if (dashboard.dueBalance <= 0) return "paid";
//     return "due";
//   };

//   const isVerified = profile?.account?.status === "verified" && profile?.customer;

//   // ── Loading ──
//   if (loading) return (
//     <div className="flex items-center justify-center min-h-screen text-sm text-gray-400">
//       Loading dashboard...
//     </div>
//   );
//   if (!profile) return null;

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-gray-950">

//       {/* ── Sticky Header ── */}
//       <header className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">

//         {/* Left: store identity */}
//         <div className="flex items-center gap-3">
//           <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-950 flex items-center justify-center text-xl">
//             🏪
//           </div>
//           <div>
//             <p className="text-base font-medium text-gray-900 dark:text-gray-100">
//               {profile.customer?.name || "My Account"}
//             </p>
//             <p className="text-xs text-gray-400 mt-0.5">
//               {profile.customer?.address || "—"}&nbsp;·&nbsp;{profile.account?.phone}
//             </p>
//           </div>
//         </div>

//         {/* Right: user + logout */}
//         <div className="flex items-center gap-3">
//           <div className="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center text-sm font-medium text-gray-500">
//             {initials(profile.customer?.name || "")}
//           </div>
//           <div className="hidden sm:block">
//             <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
//               {profile.account?.email}
//             </p>
//             {isVerified ? (
//               <span className="text-[11px] px-2 py-0.5 rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
//                 Verified
//               </span>
//             ) : (
//               <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300">
//                 Unverified
//               </span>
//             )}
//           </div>
//           <button
//             onClick={logout}
//             className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-red-50 hover:text-red-600 hover:border-red-200 dark:hover:bg-red-950 dark:hover:text-red-400 transition-colors"
//           >
//             Logout
//           </button>
//         </div>
//       </header>

//       {/* ── Body ── */}
//       <main className="max-w-4xl mx-auto px-6 py-6 space-y-5">

//         {/* Due alert */}
//         {dashboard.dueBalance > 0 && (
//           <div className="flex items-center justify-between px-4 py-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-xl">
//             <p className="text-sm text-red-700 dark:text-red-300">
//               Outstanding balance of{" "}
//               <span className="font-medium">NPR {dashboard.dueBalance.toLocaleString()}</span>{" "}
//               — please clear your dues
//             </p>
//             <button
//               onClick={() => router.push("/customer/payment")}
//               className="text-xs font-medium px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg ml-4 whitespace-nowrap transition-colors"
//             >
//               Pay now
//             </button>
//           </div>
//         )}

//         {/* Unverified notice */}
//         {!isVerified && (
//           <div className="px-4 py-3 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-xl text-sm text-amber-700 dark:text-amber-300">
//             Your account is unverified. Please contact admin to activate your account.
//           </div>
//         )}

//         {/* Stats row */}
//         <div className="grid grid-cols-3 gap-3">
//           <StatCard label="Total purchased" value={dashboard.totalSpent} />
//           <StatCard label="Total paid"      value={dashboard.totalPaid} />
//           <StatCard label="Due balance"     value={dashboard.dueBalance} danger={dashboard.dueBalance > 0} />
//         </div>

//         {/* Charts row */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

//           <Card title="Monthly spending">
//             <BarChart purchases={dashboard.recentPurchases} />
//           </Card>

//           <Card title="Recent payments">
//             {dashboard.recentPayments.length === 0 ? (
//               <p className="text-sm text-gray-400 py-2 text-center">No payments yet</p>
//             ) : (
//               <ul className="space-y-0 divide-y divide-gray-100 dark:divide-gray-800">
//                 {dashboard.recentPayments.slice(0, 4).map((p) => (
//                   <li key={p.id} className="flex items-center justify-between py-2">
//                     <div>
//                       <p className="text-sm text-gray-600 dark:text-gray-300">
//                         {new Date(p.createdAt).toLocaleDateString("en-GB", {
//                           day: "2-digit", month: "short", year: "numeric",
//                         })}
//                       </p>
//                       {p.reference && (
//                         <p className="text-[11px] text-gray-400 mt-0.5">{p.reference}</p>
//                       )}
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <MethodPill method={p.method} />
//                       <span className="text-sm font-medium text-green-700 dark:text-green-400">
//                         NPR {p.amount.toLocaleString()}
//                       </span>
//                     </div>
//                   </li>
//                 ))}
//               </ul>
//             )}
//           </Card>
//         </div>

//         {/* Purchases table */}
//         <Card title="Recent purchases">
//           {dashboard.recentPurchases.length === 0 ? (
//             <p className="text-sm text-gray-400 py-4 text-center">No purchases yet</p>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="w-full text-sm">
//                 <thead>
//                   <tr className="border-b border-gray-100 dark:border-gray-800">
//                     <th className="text-left text-[11px] font-medium text-gray-400 uppercase tracking-wider pb-2 pr-4">Date</th>
//                     <th className="text-left text-[11px] font-medium text-gray-400 uppercase tracking-wider pb-2 pr-4">Items</th>
//                     <th className="text-left text-[11px] font-medium text-gray-400 uppercase tracking-wider pb-2 pr-4">Ref</th>
//                     <th className="text-left text-[11px] font-medium text-gray-400 uppercase tracking-wider pb-2 pr-4">Amount</th>
//                     <th className="text-left text-[11px] font-medium text-gray-400 uppercase tracking-wider pb-2">Status</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
//                   {dashboard.recentPurchases.map((purchase) => (
//                     <tr key={purchase.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
//                       <td className="py-2.5 pr-4 text-gray-600 dark:text-gray-300 whitespace-nowrap">
//                         {new Date(purchase.createdAt).toLocaleDateString("en-GB", {
//                           day: "2-digit", month: "short", year: "numeric",
//                         })}
//                       </td>
//                       <td className="py-2.5 pr-4 text-gray-700 dark:text-gray-200">
//                         {purchase.items?.map((i) => `${i.name} ×${i.qty}`).join(", ") || "—"}
//                       </td>
//                       <td className="py-2.5 pr-4 text-[11px] text-gray-400">
//                         {purchase.referenceNo || "—"}
//                       </td>
//                       <td className="py-2.5 pr-4 font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap">
//                         NPR {purchase.total.toLocaleString()}
//                       </td>
//                       <td className="py-2.5">
//                         <StatusPill status={getPurchaseStatus(purchase)} />
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </Card>

//       </main>
//     </div>
//   );
// }


"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// ── Sub-components ──────────────────────────────────────────

function StatCard({ label, value, danger }) {
  return (
    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{label}</p>
      <p
        className={`text-2xl font-medium ${
          danger ? "text-red-600 dark:text-red-400" : "text-gray-900 dark:text-gray-100"
        }`}
      >
        NPR {value.toLocaleString()}
      </p>
    </div>
  );
}

function MethodPill({ method }) {
  const styles = {
    CASH: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    BANK: "bg-blue-100  text-blue-800  dark:bg-blue-900  dark:text-blue-300",
    KHALTI: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300",
    ESEWA: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  };
  return (
    <span
      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
        styles[method?.toUpperCase()] ?? "bg-gray-100 text-gray-600"
      }`}
    >
      {method}
    </span>
  );
}

// ── New component: SaleStatusPill ───────────────────────────
function SaleStatusPill({ status }) {
  const styles = {
    PENDING: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
    PROCESSING: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    SHIPPED: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300",
    OUT_FOR_DELIVERY: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300",
    DELIVERED: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    CANCELLED: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  };

  const labels = {
    PENDING: "Pending",
    PROCESSING: "Processing",
    SHIPPED: "Shipped",
    OUT_FOR_DELIVERY: "Out for Delivery",
    DELIVERED: "Delivered",
    CANCELLED: "Cancelled",
  };

  return (
    <span
      className={`text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap ${
        styles[status] ?? "bg-gray-100 text-gray-600"
      }`}
    >
      {labels[status] || status}
    </span>
  );
}

function BarChart({ purchases }) {
  const monthly = purchases.reduce((acc, p) => {
    const month = new Date(p.createdAt).toLocaleString("default", { month: "short" });
    acc[month] = (acc[month] || 0) + p.total;
    return acc;
  }, {});
  const entries = Object.entries(monthly);
  const max = Math.max(...entries.map(([, v]) => v), 1);

  if (entries.length === 0) {
    return <p className="text-sm text-gray-400 py-4 text-center">No purchase data yet</p>;
  }

  return (
    <div className="flex items-end gap-1.5 h-20">
      {entries.map(([month, total], i) => (
        <div key={month} className="flex flex-col items-center gap-1 flex-1">
          <div
            title={`NPR ${total.toLocaleString()}`}
            style={{ height: `${Math.round((total / max) * 72)}px` }}
            className={`w-full rounded-t transition-all ${
              i === entries.length - 1
                ? "bg-blue-500 dark:bg-blue-400"
                : "bg-blue-200 dark:bg-blue-800"
            }`}
          />
          <span className="text-[10px] text-gray-400">{month}</span>
        </div>
      ))}
    </div>
  );
}

function Card({ title, children }) {
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
      {title && (
        <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-3">
          {title}
        </p>
      )}
      {children}
    </div>
  );
}

// ── Main Dashboard ──────────────────────────────────────────

export default function CustomerDashboard() {
  const [profile, setProfile] = useState(null);
  const [dashboard, setDashboard] = useState({
    totalSpent: 0,
    totalPaid: 0,
    dueBalance: 0,
    recentPurchases: [],
    recentPayments: [],
  });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/customer/login");
        return;
      }
      const headers = { Authorization: `Bearer ${token}` };
      try {
        const [profileRes, dashboardRes] = await Promise.all([
          fetch("/api/customer-auth/profile", { headers }).then((r) => r.json()),
          fetch("/api/customer-auth/dashboard", { headers }).then((r) => r.json()),
        ]);
        setProfile(profileRes);
        setDashboard({
          totalSpent: dashboardRes.totalSpent || 0,
          totalPaid: dashboardRes.totalPaid || 0,
          dueBalance: dashboardRes.dueBalance || 0,
          recentPurchases: dashboardRes.recentPurchases || [],
          recentPayments: dashboardRes.recentPayments || [],
        });
      } catch {
        router.push("/customer/login");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, [router]);

  const logout = () => {
    localStorage.removeItem("token");
    router.push("/customer/login");
  };

  const initials = (name) =>
    name
      ? name
          .split(" ")
          .map((w) => w[0])
          .join("")
          .slice(0, 2)
          .toUpperCase()
      : "??";

  const isVerified = profile?.account?.status === "verified" && profile?.customer;

  // ── Loading ──
  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen text-sm text-gray-400">
        Loading dashboard...
      </div>
    );
  if (!profile) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">

      {/* ── Sticky Header ── */}
      <header className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">

        {/* Left: store identity */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-950 flex items-center justify-center text-xl">
            🏪
          </div>
          <div>
            <p className="text-base font-medium text-gray-900 dark:text-gray-100">
              {profile.customer?.name || "My Account"}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              {profile.customer?.address || "—"} · {profile.account?.phone}
            </p>
          </div>
        </div>

        {/* Right: user + logout */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center text-sm font-medium text-gray-500">
            {initials(profile.customer?.name || "")}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {profile.account?.email}
            </p>
            {isVerified ? (
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                Verified
              </span>
            ) : (
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300">
                Unverified
              </span>
            )}
          </div>
          <button
            onClick={logout}
            className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-red-50 hover:text-red-600 hover:border-red-200 dark:hover:bg-red-950 dark:hover:text-red-400 transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      {/* ── Body ── */}
      <main className="max-w-4xl mx-auto px-6 py-6 space-y-5">

        {/* Due alert */}
        {dashboard.dueBalance > 0 && (
          <div className="flex items-center justify-between px-4 py-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-xl">
            <p className="text-sm text-red-700 dark:text-red-300">
              Outstanding balance of{" "}
              <span className="font-medium">NPR {dashboard.dueBalance.toLocaleString()}</span>{" "}
              — please clear your dues
            </p>
            <button
              onClick={() => router.push("/customer/payment")}
              className="text-xs font-medium px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg ml-4 whitespace-nowrap transition-colors"
            >
              Pay now
            </button>
          </div>
        )}

        {/* Unverified notice */}
        {!isVerified && (
          <div className="px-4 py-3 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-xl text-sm text-amber-700 dark:text-amber-300">
            Your account is unverified. Please contact admin to activate your account.
          </div>
        )}

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3">
          <StatCard label="Total purchased" value={dashboard.totalSpent} />
          <StatCard label="Total paid" value={dashboard.totalPaid} />
          <StatCard
            label="Due balance"
            value={dashboard.dueBalance}
            danger={dashboard.dueBalance > 0}
          />
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          <Card title="Monthly spending">
            <BarChart purchases={dashboard.recentPurchases} />
          </Card>

          <Card title="Recent payments">
            {dashboard.recentPayments.length === 0 ? (
              <p className="text-sm text-gray-400 py-2 text-center">No payments yet</p>
            ) : (
              <ul className="space-y-0 divide-y divide-gray-100 dark:divide-gray-800">
                {dashboard.recentPayments.slice(0, 4).map((p) => (
                  <li key={p.id} className="flex items-center justify-between py-2">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {new Date(p.createdAt).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                      {p.reference && (
                        <p className="text-[11px] text-gray-400 mt-0.5">{p.reference}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <MethodPill method={p.method} />
                      <span className="text-sm font-medium text-green-700 dark:text-green-400">
                        NPR {p.amount.toLocaleString()}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>

        {/* Purchases table */}
        <Card title="Recent purchases">
          {dashboard.recentPurchases.length === 0 ? (
            <p className="text-sm text-gray-400 py-4 text-center">No purchases yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    <th className="text-left text-[11px] font-medium text-gray-400 uppercase tracking-wider pb-2 pr-4">
                      Date
                    </th>
                    <th className="text-left text-[11px] font-medium text-gray-400 uppercase tracking-wider pb-2 pr-4">
                      Items
                    </th>
                    <th className="text-left text-[11px] font-medium text-gray-400 uppercase tracking-wider pb-2 pr-4">
                      Ref
                    </th>
                    <th className="text-left text-[11px] font-medium text-gray-400 uppercase tracking-wider pb-2 pr-4">
                      Amount
                    </th>
                    <th className="text-left text-[11px] font-medium text-gray-400 uppercase tracking-wider pb-2">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {dashboard.recentPurchases.map((purchase) => (
                    <tr
                      key={purchase.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <td className="py-2.5 pr-4 text-gray-600 dark:text-gray-300 whitespace-nowrap">
                        {new Date(purchase.createdAt).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="py-2.5 pr-4 text-gray-700 dark:text-gray-200">
                        {purchase.items?.map((i) => `${i.name} ×${i.qty}`).join(", ") || "—"}
                      </td>
                      <td className="py-2.5 pr-4 text-[11px] text-gray-400">
                        {purchase.referenceNo || "—"}
                      </td>
                      <td className="py-2.5 pr-4 font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap">
                        NPR {purchase.total.toLocaleString()}
                      </td>
                      <td className="py-2.5">
                        <SaleStatusPill status={purchase.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

      </main>
    </div>
  );
}