// "use client";

// import { useEffect, useState } from "react";
// import { getData } from "@/lib/getData";
// import { Loader2 } from "lucide-react";

// export default function LowStockPage() {
//   const [items, setItems] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [lowStockItems, setLowStockItems] = useState([]);

//   // 🔹 Fetch items
//   useEffect(() => {
//     async function fetchItems() {
//       try {
//         const itemsData = await getData("items");
//         setItems(itemsData || []);
//       } catch (error) {
//         console.error("Failed to fetch items:", error);
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchItems();
//   }, []);

//   // 🔹 Filter low stock items
//   useEffect(() => {
//     if (!items.length) return;

//     const lowStock = items.filter(
//       (item) => item.quantity > 0 && item.quantity <= (item.reOrderPoint || 5)
//     );

//     setLowStockItems(lowStock);
//   }, [items]);

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-96">
//         <Loader2 className="animate-spin text-blue-600" size={48} />
//       </div>
//     );
//   }

//   return (
//     <div className="p-6 space-y-6">
//       <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
//         Low Stock Items
//       </h1>

//       {lowStockItems.length === 0 ? (
//         <p className="text-gray-500">No low stock items!</p>
//       ) : (
//         <div className="bg-red-100 dark:bg-red-900 p-4 rounded-lg shadow-md">
//           <p className="font-semibold text-red-800 dark:text-red-200 mb-2">
//             ⚠️ Alert! {lowStockItems.length} item(s) are low in stock:
//           </p>
//           <ul className="list-disc ml-5 space-y-1 max-h-96 overflow-y-auto">
//             {lowStockItems.map((item) => (
//               <li
//                 key={item.id}
//                 className="flex justify-between py-1 border-b border-red-300 dark:border-red-700 px-2"
//               >
//                 <span>{item.title}</span>
//                 <span className="font-semibold text-red-600 dark:text-red-300">
//                   {item.quantity} left
//                 </span>
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { getData } from "@/lib/getData";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LowStockPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lowStockItems, setLowStockItems] = useState([]);
  const router = useRouter();

  // Fetch items
  useEffect(() => {
    async function fetchItems() {
      try {
        const itemsData = await getData("items");
        setItems(itemsData || []);
      } catch (error) {
        console.error("Failed to fetch items:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchItems();
  }, []);

  // Filter low stock items
  useEffect(() => {
    if (!items.length) return;

    const lowStock = items.filter(
      (item) => item.quantity > 0 && item.quantity <= (item.reOrderPoint || 5)
    );

    setLowStockItems(lowStock);
  }, [items]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="animate-spin text-blue-600" size={48} />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
        Low Stock Items
      </h1>

      {lowStockItems.length === 0 ? (
        <p className="text-gray-500">No low stock items!</p>
      ) : (
        <div className="bg-red-100 dark:bg-red-900 p-4 rounded-lg shadow-md">
          <p className="font-semibold text-red-800 dark:text-red-200 mb-2">
            ⚠️ {lowStockItems.length} item(s) are low in stock:
          </p>
          <ul className="list-disc ml-5 space-y-1 max-h-96 overflow-y-auto">
            {lowStockItems.map((item) => (
              <li
                key={item.id}
                className="flex justify-between py-1 border-b border-red-300 dark:border-red-700 px-2 cursor-pointer hover:bg-red-200 dark:hover:bg-red-800 transition"
                onClick={() => router.push("/dashboard/inventory/adjustments/new")} // just redirect
              >
                <span>{item.title}</span>
                <span className="font-semibold text-red-600 dark:text-red-300">
                  {item.quantity} left
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}