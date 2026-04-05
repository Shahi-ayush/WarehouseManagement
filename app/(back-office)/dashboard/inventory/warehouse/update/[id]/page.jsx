
// "use client";



// import NewWarehouse from "@/components/categorybyuser/NewWarehouse";
// import { useEffect, useState } from "react";

// export default function UpdateWarehouse({ params }) {
//   const { id } = params;
//   const [initialData, setInitialData] = useState(null);
//   const [loading, setLoading] = useState(true);
  

//   useEffect(() => {
//     async function fetchWarehouse() {
//       try {
//         const res = await fetch(`/api/warehouse/${id}`);
//         const data = await res.json();
//         setInitialData(data);
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     }
//     fetchWarehouse();
//   }, [id]);

//   if (loading) return <p className="text-center text-lg">Loading...</p>;
//   if (!initialData) return <p className="text-center text-lg">warehouse not found</p>;

//   return <NewWarehouse initialData={initialData} isUpdate={true} />;
// }

"use client";

import { useEffect, useState } from "react";
import NewWarehouse from "@/components/categorybyuser/NewWarehouse";
import { useRouter } from "next/navigation";

export default function UpdateWarehouse({ params }) {
  const router = useRouter();
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Since params is now a promise, we can unwrap it inside useEffect
  useEffect(() => {
    async function fetchWarehouse() {
      try {
        const { id } = await params; // unwrap params
        const res = await fetch(`/api/warehouse/${id}`);
        if (!res.ok) throw new Error("Failed to fetch warehouse");
        const data = await res.json();
        setInitialData(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchWarehouse();
  }, [params]);

  if (loading) return <p>Loading...</p>;
  if (!initialData) return <p>Warehouse not found</p>;

  return <NewWarehouse isUpdate={true} initialData={initialData} />;
}