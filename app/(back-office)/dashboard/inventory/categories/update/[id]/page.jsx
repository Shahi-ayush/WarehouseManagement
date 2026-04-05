
// "use client";
// import NewCategory from "@/components/categorybyuser/NewCategory";
// import { useEffect, useState } from "react";

// export default function UpdateCategory({ params }) {
//   const { id } = params;
//   const [initialData, setInitialData] = useState(null);
//   const [loading, setLoading] = useState(true);
  

//   useEffect(() => {
//     async function fetchCategory() {
//       try {
//         const res = await fetch(`/api/categories/${id}`);
//         const data = await res.json();
//         setInitialData(data);
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     }
//     fetchCategory();
//   }, [id]);

//   if (loading) return <p className="text-center text-lg">Loading...</p>;
//   if (!initialData) return <p className="text-center text-lg">Category not found</p>;

//   return <NewCategory initialData={initialData} isUpdate={true} />;
// }


"use client";
import { useState, useEffect } from "react";
import NewCategory from "@/components/categorybyuser/NewCategory";

export default function EditCategory({ params }) {
  const [id, setId] = useState(null);
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Resolve params promise
  useEffect(() => {
    Promise.resolve(params).then((p) => setId(p.id));
  }, [params]);

  // Fetch category data
  useEffect(() => {
    if (!id) return;
    async function fetchData() {
      try {
        const res = await fetch(`/api/categories/${id}`);
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
  if (!initialData) return <p className="text-center text-lg">Category not found</p>;

  return <NewCategory isUpdate={true} initialData={initialData} />;
}