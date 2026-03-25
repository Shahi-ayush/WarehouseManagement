"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";
import Header from "@/components/dashboard/Header";
import Leftmenu from "@/components/dashboard/Leftmenu";
import Login from "../login/page";

export default function Layout({ children }) {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-slate-600">
        <Loader2 className="animate-spin mb-2 text-blue-600" size={32} />
        <p>Loading user, please wait...</p>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return <Login />;
  }

  return (
    <div className="flex">
      <Leftmenu />
      <main className="ml-64 w-full min-h-screen bg-slate-100">
        <Header />
        {children}
      </main>
    </div>
  );
}
