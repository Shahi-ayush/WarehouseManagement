
// "use client";

// import NewSupplier from "@/components/categorybyuser/NewSupplier";
// import { useEffect, useState } from "react";

// export default function UpdateSupplier({ params }) {
//   const { id } = params;
//   const [initialData, setInitialData] = useState(null);
//   const [loading, setLoading] = useState(true);
  

//   useEffect(() => {
//     async function fetchSupplier() {
//       try {
//         const res = await fetch(`/api/suppliers/${id}`);
//         const data = await res.json();
//         setInitialData(data);
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     }
//     fetchSupplier();
//   }, [id]);

//   if (loading) return <p className="text-center text-lg">Loading...</p>;
//   if (!initialData) return <p className="text-center text-lg">Supplier not found</p>;

//   return <NewSupplier initialData={initialData} isUpdate={true} />;
// }


"use client";
import { useState, useEffect } from "react";
import NewSupplier from "@/components/categorybyuser/NewSupplier";

export default function EditSupplier({ params }) {
  const [id, setId] = useState(null);
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.resolve(params).then((p) => setId(p.id));
  }, [params]);

  useEffect(() => {
    if (!id) return;
    async function fetchData() {
      try {
        const res = await fetch(`/api/suppliers/${id}`);
        const data = await res.json();
        setInitialData(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  if (loading) return <p className="text-center text-lg">Loading...</p>;
  if (!initialData) return <p className="text-center text-lg">Supplier not found</p>;

  return <NewSupplier isUpdate={true} initialData={initialData} />;
}