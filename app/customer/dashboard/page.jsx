

// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { motion } from "framer-motion";
// import { BarChart, Bar, XAxis, YAxis, PieChart, Pie, Cell, Tooltip } from "recharts";

// export default function CustomerDashboard() {
//   const [profile, setProfile] = useState(null);
//   const [dashboard, setDashboard] = useState({
//     totalSpent: 0,
//     totalPaid: 0,
//     dueBalance: 0,
//     recentPurchases: [],
//     recentPayments: [],
//   });
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");
//   const router = useRouter();

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       router.push("/customer/login");
//       return;
//     }

//     const headers = { Authorization: `Bearer ${token}` };

//     Promise.all([
//       fetch("/api/customer-auth/profile", { headers }).then(r => r.json()),
//       fetch("/api/customer-auth/dashboard", { headers }).then(r => r.json()),
//     ])
//       .then(([profileData, dashboardData]) => {
//         setProfile(profileData);

//         setDashboard({
//           totalSpent: dashboardData.totalSpent || 0,
//           totalPaid: dashboardData.totalPaid || 0,
//           dueBalance: dashboardData.dueBalance || 0,
//           recentPurchases: dashboardData.recentPurchases || [],
//           recentPayments: dashboardData.recentPayments || [],
//         });

//         setLoading(false);
//       })
//       .catch(() => router.push("/customer/login"));
//   }, [router]);

//   if (loading) return <p className="p-8 text-center">Loading dashboard...</p>;
//   if (!profile) return <p className="p-8 text-center">No profile data</p>;

//   // Filter purchases by search term
//   const filteredPurchases = dashboard.recentPurchases.filter(p =>
//     p.items.some(i => i.name.toLowerCase().includes(searchTerm.toLowerCase()))
//   );

//   // Prepare data for charts
//   const monthlySpending = dashboard.recentPurchases.reduce((acc, p) => {
//     const month = new Date(p.createdAt).toLocaleString("default", { month: "short" });
//     acc[month] = (acc[month] || 0) + p.total;
//     return acc;
//   }, {});

//   const spendingData = Object.entries(monthlySpending).map(([month, total]) => ({ month, total }));

//   const paymentMethods = dashboard.recentPayments.reduce((acc, p) => {
//     acc[p.method] = (acc[p.method] || 0) + p.amount;
//     return acc;
//   }, {});
//   const paymentData = Object.entries(paymentMethods).map(([method, amount]) => ({ method, amount }));
//   const colors = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"];

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto space-y-6">

//         {/* Header */}
//         <div className="flex justify-between items-center">
//           <div>
//             <h1 className="text-3xl font-bold">Welcome, {profile.customer?.name}</h1>
//             <p className="text-gray-500">Customer Dashboard</p>
//           </div>
//           <Button
//             className="bg-red-500 text-white hover:bg-red-600"
//             onClick={() => {
//               localStorage.removeItem("token");
//               router.push("/customer/login");
//             }}
//           >
//             Logout
//           </Button>
//         </div>
//            <Card className="rounded-2xl shadow-sm">
//   <CardContent className="p-6 space-y-4">
//     <h2 className="text-xl font-semibold">Profile Information</h2>

//     <div className="flex items-center justify-between">
//       {/* Profile details */}
//       <div className="space-y-2">
//         <p><strong>Email:</strong> {profile.account?.email}</p>
//         <p><strong>Phone:</strong> {profile.account?.phone}</p>
//         <p><strong>Address:</strong> {profile.customer?.address || "—"}</p>

//         {/* ✅ Status badge */}
//         <p>
//           <strong>Status:</strong>{" "}
//           <span
//             className={`px-2 py-1 rounded-full text-sm font-medium ${
//               profile.account?.status === "verified" && profile.customer
//                 ? "bg-green-100 text-green-800"
//                 : "bg-yellow-100 text-yellow-800"
//             }`}
//           >
//             {profile.account?.status === "verified" && profile.customer
//               ? "Verified"
//               : "Unverified"}
//           </span>
//         </p>
//       </div>

//       {/* Profile photo */}
//       <div className="flex flex-col items-center">
//         <img
//           src={profile.customer?.avatarUrl || "/default-avatar.png"}
//           alt="Profile Photo"
//           className="w-24 h-24 rounded-full object-cover border border-gray-300 mb-2"
//         />

//         <input
//           type="file"
//           accept="image/*"
//           id="avatarUpload"
//           className="hidden"
//           onChange={async (e) => {
//             const file = e.target.files?.[0];
//             if (!file) return;

//             // Preview locally
//             const reader = new FileReader();
//             reader.onload = () => {
//               setProfile((prev) => ({
//                 ...prev,
//                 customer: {
//                   ...prev.customer,
//                   avatarUrl: reader.result,
//                 },
//               }));
//             };
//             reader.readAsDataURL(file);

//             // Upload to server
//             const formData = new FormData();
//             formData.append("avatar", file);

//             await fetch("/api/customer-auth/upload-avatar", {
//               method: "POST",
//               body: formData,
//             });
//           }}
//         />

//         <label
//           htmlFor="avatarUpload"
//           className="cursor-pointer mt-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium"
//         >
//           {profile.customer?.avatarUrl ? "Change Photo" : "Add Photo"}
//         </label>
//       </div>
//     </div>
//   </CardContent>
// </Card>



//         {/* Stats */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           <StatCard title="Total Spent" value={dashboard.totalSpent} />
//           <StatCard title="Total Paid" value={dashboard.totalPaid} />
//           <StatCard title="Due Balance" value={dashboard.dueBalance} highlight />
//         </div>

      

//         {/* Charts */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <Card className="rounded-2xl shadow-sm p-6">
//             <h2 className="text-xl font-semibold mb-3">Monthly Spending</h2>
//             <BarChart width={400} height={200} data={spendingData}>
//               <XAxis dataKey="month" />
//               <YAxis />
//               <Tooltip />
//               <Bar dataKey="total" fill="#36A2EB" />
//             </BarChart>
//           </Card>

//           <Card className="rounded-2xl shadow-sm p-6">
//             <h2 className="text-xl font-semibold mb-3">Payments by Method</h2>
//             <PieChart width={200} height={200}>
//               <Pie data={paymentData} dataKey="amount" nameKey="method" cx="50%" cy="50%" outerRadius={80}>
//                 {paymentData.map((entry, index) => (
//                   <Cell key={index} fill={colors[index % colors.length]} />
//                 ))}
//               </Pie>
//               <Tooltip />
//             </PieChart>
//           </Card>
//         </div>

     
//         {/* Purchases Search */}
//         <div className="mt-4">
//           <input
//             type="text"
//             placeholder="Search purchases by item name..."
//             value={searchTerm}
//             onChange={e => setSearchTerm(e.target.value)}
//             className="w-full p-2 rounded-lg border border-gray-300 mb-4"
//           />
//         </div>

//         {/* Activity */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <ActivityCard title="Recent Purchases" items={filteredPurchases} type="purchase" fixedDetails={true} />
//           <ActivityCard title="Recent Payments" items={dashboard.recentPayments} type="payment" fixedDetails={true} />
//         </div>

//       </motion.div>
//     </div>
//   );
// }

// // StatCard component
// function StatCard({ title, value, highlight }) {
//   return (
//     <Card className={`rounded-2xl shadow-sm ${highlight ? "border-red-400" : ""}`}>
//       <CardContent className="p-6 text-center">
//         <p className="text-gray-500">{title}</p>
//         <p className="text-3xl font-bold mt-2">NPR {value}</p>
//       </CardContent>
//     </Card>
//   );
// }

// // ActivityCard component
// function ActivityCard({ title, items, type, fixedDetails }) {
//   return (
//     <Card className="rounded-2xl shadow-sm">
//       <CardContent className="p-6">
//         <h2 className="text-xl font-semibold mb-3">{title}</h2>
//         {items.length === 0 ? (
//           <p className="text-gray-500">No records found</p>
//         ) : (
//           <ul className="space-y-2">
//             {items.map(item => (
//               <li key={item.id} className="border-b pb-2">
//                 <div className="flex justify-between items-center">
//                   <span>{new Date(item.createdAt).toLocaleDateString()}</span>
//                   <span className="font-medium">
//                     {type === "purchase" ? `NPR ${item.total}` : `NPR ${item.amount}`}
//                   </span>
//                 </div>

//                 {/* Fixed Details */}
//                 {type === "purchase" && item.items && fixedDetails && (
//                   <div className="mt-2 p-2 bg-gray-50 rounded-lg space-y-1 text-sm text-gray-700">
//                     <strong>Purchase Details:</strong>
//                     <ul className="ml-4 list-disc">
//                       {item.items.map((i, idx) => (
//                         <li key={idx}>
//                           {i.name} — Qty: {i.qty}
//                         </li>
//                       ))}
//                     </ul>
//                     <p className="text-sm text-gray-500 mt-1">
//                       Total Items: {item.items.reduce((sum, i) => sum + i.qty, 0)}
//                     </p>
//                   </div>
//                 )}

//                 {type === "payment" && fixedDetails && (
//                   <div className="mt-2 p-2 bg-gray-50 rounded-lg space-y-1 text-sm text-gray-700">
//                     <p><strong>Payment Method:</strong> {item.method || "—"}</p>
//                     {item.reference && <p><strong>Reference:</strong> {item.reference}</p>}
//                   </div>
//                 )}
//               </li>
//             ))}
//           </ul>
//         )}
//       </CardContent>
//     </Card>
//   );
// }


"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, PieChart, Pie, Cell, Tooltip } from "recharts";

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
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  useEffect(() => {
    let interval;

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

        setLoading(false);
      } catch (err) {
        router.push("/customer/login");
      }
    };

    // Fetch immediately on mount
    fetchData();

    // Poll every 10 seconds to auto-refresh profile and dashboard
    interval = setInterval(fetchData, 10000);

    return () => clearInterval(interval);
  }, [router]);

  if (loading) return <p className="p-8 text-center">Loading dashboard...</p>;
  if (!profile) return <p className="p-8 text-center">No profile data</p>;

  // Filter purchases by search term
  const filteredPurchases = dashboard.recentPurchases.filter((p) =>
    p.items.some((i) => i.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Prepare data for charts
  const monthlySpending = dashboard.recentPurchases.reduce((acc, p) => {
    const month = new Date(p.createdAt).toLocaleString("default", { month: "short" });
    acc[month] = (acc[month] || 0) + p.total;
    return acc;
  }, {});

  const spendingData = Object.entries(monthlySpending).map(([month, total]) => ({ month, total }));

  const paymentMethods = dashboard.recentPayments.reduce((acc, p) => {
    acc[p.method] = (acc[p.method] || 0) + p.amount;
    return acc;
  }, {});

  const paymentData = Object.entries(paymentMethods).map(([method, amount]) => ({ method, amount }));
  const colors = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto space-y-6"
      >
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Welcome, {profile.customer?.name || "Customer"}</h1>
            <p className="text-gray-500">Customer Dashboard</p>
          </div>
          <Button
            className="bg-red-500 text-white hover:bg-red-600"
            onClick={() => {
              localStorage.removeItem("token");
              router.push("/customer/login");
            }}
          >
            Logout
          </Button>
        </div>

        {/* Profile Card */}
     {/* Profile Card */}
<Card className="rounded-2xl shadow-sm">
  <CardContent className="p-6 space-y-4">
    <h2 className="text-xl font-semibold">Profile Information</h2>

    <div className="flex items-center justify-between">
      {/* Profile details */}
      <div className="space-y-2">
        <p><strong>Email:</strong> {profile.account?.email}</p>
        <p><strong>Phone:</strong> {profile.account?.phone}</p>
        <p><strong>Address:</strong> {profile.customer?.address || "—"}</p>

        {/* Verified / Unverified Badge */}
        <p>
          <strong>Status:</strong>{" "}
          <span
            className={`px-2 py-1 rounded-full text-sm font-medium ${
              profile.account?.status === "verified" && profile.customer
                ? "bg-green-100 text-green-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {profile.account?.status === "verified" && profile.customer
              ? "Verified"
              : "Unverified"}
          </span>
        </p>

        {/* ✅ Unverified message */}
        {(!profile.customer || profile.account?.status !== "verified") && (
          <p className="text-red-600 text-sm mt-1">
            To verify or approve your account, please contact admin support.
          </p>
        )}
      </div>

      {/* Profile photo */}
      <div className="flex flex-col items-center">
        <img
          src={profile.customer?.avatarUrl || "/default-avatar.png"}
          alt="Profile Photo"
          className="w-24 h-24 rounded-full object-cover border border-gray-300 mb-2"
        />

        <input
          type="file"
          accept="image/*"
          id="avatarUpload"
          className="hidden"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = () => {
              setProfile((prev) => ({
                ...prev,
                customer: {
                  ...prev.customer,
                  avatarUrl: reader.result,
                },
              }));
            };
            reader.readAsDataURL(file);

            const formData = new FormData();
            formData.append("avatar", file);

            await fetch("/api/customer-auth/upload-avatar", {
              method: "POST",
              body: formData,
            });
          }}
        />

        <label
          htmlFor="avatarUpload"
          className="cursor-pointer mt-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium"
        >
          {profile.customer?.avatarUrl ? "Change Photo" : "Add Photo"}
        </label>
      </div>
    </div>
  </CardContent>
</Card>


        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard title="Total Spent" value={dashboard.totalSpent} />
          <StatCard title="Total Paid" value={dashboard.totalPaid} />
          <StatCard title="Due Balance" value={dashboard.dueBalance} highlight />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-3">Monthly Spending</h2>
            <BarChart width={400} height={200} data={spendingData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total" fill="#36A2EB" />
            </BarChart>
          </Card>

          <Card className="rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-3">Payments by Method</h2>
            <PieChart width={200} height={200}>
              <Pie data={paymentData} dataKey="amount" nameKey="method" cx="50%" cy="50%" outerRadius={80}>
                {paymentData.map((entry, index) => (
                  <Cell key={index} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </Card>
        </div>

        {/* Purchases Search */}
        <div className="mt-4">
          <input
            type="text"
            placeholder="Search purchases by item name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 rounded-lg border border-gray-300 mb-4"
          />
        </div>

        {/* Activity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ActivityCard title="Recent Purchases" items={filteredPurchases} type="purchase" fixedDetails={true} />
          <ActivityCard title="Recent Payments" items={dashboard.recentPayments} type="payment" fixedDetails={true} />
        </div>
      </motion.div>
    </div>
  );
}

// StatCard component
function StatCard({ title, value, highlight }) {
  return (
    <Card className={`rounded-2xl shadow-sm ${highlight ? "border-red-400" : ""}`}>
      <CardContent className="p-6 text-center">
        <p className="text-gray-500">{title}</p>
        <p className="text-3xl font-bold mt-2">NPR {value}</p>
      </CardContent>
    </Card>
  );
}

// ActivityCard component
function ActivityCard({ title, items, type, fixedDetails }) {
  return (
    <Card className="rounded-2xl shadow-sm">
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-3">{title}</h2>
        {items.length === 0 ? (
          <p className="text-gray-500">No records found</p>
        ) : (
          <ul className="space-y-2">
            {items.map((item) => (
              <li key={item.id} className="border-b pb-2">
                <div className="flex justify-between items-center">
                  <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                  <span className="font-medium">
                    {type === "purchase" ? `NPR ${item.total}` : `NPR ${item.amount}`}
                  </span>
                </div>

                {/* Fixed Details */}
                {type === "purchase" && item.items && fixedDetails && (
                  <div className="mt-2 p-2 bg-gray-50 rounded-lg space-y-1 text-sm text-gray-700">
                    <strong>Purchase Details:</strong>
                    <ul className="ml-4 list-disc">
                      {item.items.map((i, idx) => (
                        <li key={idx}>
                          {i.name} — Qty: {i.qty}
                        </li>
                      ))}
                    </ul>
                    <p className="text-sm text-gray-500 mt-1">
                      Total Items: {item.items.reduce((sum, i) => sum + i.qty, 0)}
                    </p>
                  </div>
                )}

                {type === "payment" && fixedDetails && (
                  <div className="mt-2 p-2 bg-gray-50 rounded-lg space-y-1 text-sm text-gray-700">
                    <p><strong>Payment Method:</strong> {item.method || "—"}</p>
                    {item.reference && <p><strong>Reference:</strong> {item.reference}</p>}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
