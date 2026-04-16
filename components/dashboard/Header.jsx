
"use client";

import { Bell, ChevronDown, HistoryIcon, LayoutGridIcon, Plus, Users2, Settings, X } from "lucide-react";
import React, { useState } from "react";
import SearchInput from "./SearchInput";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { generateInitials } from "@/lib/generateInitials";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Header() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  if (status === "loading") {
    return <p className="p-5 text-slate-600 animate-pulse">Loading User...</p>;
  }

  if (status === "unauthenticated") {
    router.push("/login");
  }

  const username = session?.user?.name?.split(" ")[0] || "User";
  const initials = generateInitials(session?.user?.name || "User");

  // Fetch all accounts and filter unverified/unlinked
  const handleBellClick = async () => {
    try {
      const res = await fetch("/api/customer-auth/customer-accounts");
      if (!res.ok) return;

      const data = await res.json();
      // Filter only unverified or unlinked accounts
      const unverified = data.accounts.filter(
        (acc) => acc.status === "unverified" || !acc.customerId
      );
      setNotifications(unverified);
      setShowNotifications((prev) => !prev);
    } catch (err) {
      console.error(err);
    }
  };

  // // Optional: Remove a notification manually
  // const dismissNotification = (id) => {
  //   setNotifications((prev) => prev.filter((n) => n.id !== id));
  // };

  return (
    <div className="bg-slate-200 h-12 flex items-center justify-between px-6 border-b border-slate-300 shadow-sm relative">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <button className="p-1 hover:bg-slate-300 rounded-lg">
          <HistoryIcon className="w-5 h-5 text-slate-800" />
        </button>
        <SearchInput />
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4 relative">
        <div className="pr-2 border-r border-gray-300">
          <button className="p-1 bg-blue-600 rounded-lg hover:bg-blue-700 transition">
            <Plus className="text-white w-4 h-4" />
          </button>
        </div>

        {/* Icons */}
        <div className="flex border-r border-gray-300 pr-2 space-x-2 relative">
          
          {/* Bell Notification */}
          <button
            className="p-1 hover:bg-slate-300 rounded-lg transition relative"
            onClick={handleBellClick}
          >
            <Bell className="w-4 h-4 text-slate-800" />
            {notifications.length > 0 && (
              <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-red-500" />
            )}
          </button>

          {/* Notification Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-10 w-80 bg-white border border-gray-300 shadow-lg rounded-lg z-50 max-h-96 overflow-y-auto">
              <h3 className="text-gray-800 font-semibold px-4 py-2 border-b border-gray-200">
                Unverified Accounts
              </h3>
              {notifications.length === 0 ? (
                <p className="p-4 text-gray-500">No unverified users</p>
              ) : (
                <ul>
                  {notifications.map((user) => (
                    <li
                      key={user.id}
                      className="p-4 border-b border-gray-100 hover:bg-gray-50 flex justify-between items-start cursor-pointer"
                    >
                      <div
                        onClick={() =>
                          router.push(
                            `/dashboard/purchases/allcustomers/new/?phone=${encodeURIComponent(
                              user.phone
                            )}`
                          )
                        }
                      >
                        <p className="text-sm font-medium text-red-600">{user.email}</p>
                        <p className="text-xs text-gray-500">
                          Signed up on: {new Date(user.createdAt).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          To verify, contact admin support.
                        </p>
                      </div>
                      <button
                        onClick={() => dismissNotification(user.id)}
                        className="p-1 hover:bg-gray-200 rounded-full"
                      >
                        <X className="w-3 h-3 text-gray-500" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          
        </div>

        {/* User Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger>
            <div className="flex items-center gap-2 cursor-pointer">
              <span className="text-slate-800 font-medium">{username}</span>
              <ChevronDown className="w-4 h-4 text-slate-800" />
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push('/dashboard/home/profile')}>My Profile</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOut()}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Avatar */}
        <div>
          {session?.user?.image ? (
            <Image
              src={session.user.image}
              alt="user image"
              width={32}
              height={32}
              className="rounded-full border border-slate-900 w-8 h-8"
            />
          ) : (
            <div className="rounded-full border border-slate-900 w-8 h-8 bg-white flex items-center justify-center text-sm font-semibold text-slate-800">
              {initials}
            </div>
          )}
        </div>

    
      </div>
    </div>
  );
}
