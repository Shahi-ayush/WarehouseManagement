// components/dashboard/UnverifiedToastNotifier.jsx
"use client";

import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function UnverifiedToastNotifier() {
  const [shownIds, setShownIds] = useState(new Set());

  useEffect(() => {
    let interval;

   const fetchUnverified = async () => {
  try {
    const res = await fetch("/api/customer-auth/unverified-customers");
    
    // Make sure the response is JSON
    if (!res.ok) {
      console.error("Failed to fetch unverified users");
      return;
    }

    const data = await res.json(); // <-- correctly parse JSON

    if (data.unverified?.length > 0) {
      data.unverified.forEach((user) => {
        if (!shownIds.has(user.id)) {
          toast(
            <div>
              <strong>{user.email}</strong> just signed up and is unverified.<br />
              Contact admin support to approve.
            </div>,
            {
              style: {
                border: "1px solid #f87171",
                padding: "12px",
                color: "#b91c1c",
                background: "#fff7f7",
              },
              icon: "⚠️",
            }
          );

          setShownIds((prev) => new Set(prev).add(user.id));
        }
      });
    }
  } catch (err) {
    console.error(err);
  }
};


    fetchUnverified();
    interval = setInterval(fetchUnverified, 10000); // poll every 10s

    return () => clearInterval(interval);
  }, [shownIds]);

  return <Toaster position="top-right" reverseOrder={false} />;
}
