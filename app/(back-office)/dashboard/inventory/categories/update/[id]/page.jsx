
"use client";
import NewCategory from "@/components/categorybyuser/NewCategory";
import { useEffect, useState } from "react";

export default function UpdateCategory({ params }) {
  const { id } = params;
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    async function fetchCategory() {
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
    fetchCategory();
  }, [id]);

  if (loading) return <p className="text-center text-lg">Loading...</p>;
  if (!initialData) return <p className="text-center text-lg">Category not found</p>;

  return <NewCategory initialData={initialData} isUpdate={true} />;
}
