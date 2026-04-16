"use client";

import { Building2, Dot} from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export default function HomeNavbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  if (status === "loading") {
    return <p className="p-5 text-slate-600 text-sm animate-pulse">Loading user...</p>;
  }


  const username = session?.user?.name
    ? session.user.name.toUpperCase()
    : "USER";

  const navLinks = [
    { title: "Dashboard", href: "/dashboard/home/overview" },
        { title: "WishList", href: "/dashboard/home/announcements" },

    { title: "Low Stock Overview", href: "/dashboard/home/getting-started" },
  ];

  return (
    <header className="h-32 px-6 py-4 header-bg bg-slate-60 border-b border-slate-300 shadow-sm">
      {/* Top User Section */}
      <div className="flex items-center space-x-3">
        <div className="flex w-12 h-12 rounded-lg bg-white shadow items-center justify-center text-blue-600">
          <Building2 className="w-6 h-6" />
        </div>

        <div className="flex flex-col">
          <p className="text-slate-800 font-semibold">
            Hello, {username}
          </p>
          <div className="flex items-center text-sm text-slate-600 mt-1">
            <Dot className="w-4 h-4 text-green-500" />
            <span className="ml-1">Active</span>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="mt-5 flex space-x-6  border-slate-300 pt-3">
        {navLinks.map((item, i) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={i}
              href={item.href}
              className={`relative text-sm font-medium transition-all duration-200
                ${isActive ? "text-blue-600" : "text-slate-700 hover:text-blue-500"}`}
            >
              {item.title}
              {isActive && (
                <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-blue-600 rounded-full" />
              )}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
