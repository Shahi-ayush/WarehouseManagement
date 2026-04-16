"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/DashboardRefactor/Header";
import Alerts from "@/components/DashboardRefactor/Alerts";
import Stats from "@/components/DashboardRefactor/Stats";
import Card from "@/components/DashboardRefactor/Card";
import BarChart from "@/components/DashboardRefactor/BarChart";
import PaymentsList from "@/components/DashboardRefactor/PaymentsList";
import PurchasesTable from "@/components/DashboardRefactor/PurchasesTable";
import WishlistList from "@/components/Wishlist/WishlistList";

export default function CustomerDashboard() {
  const [profile, setProfile] = useState(null);
  const [dashboard, setDashboard] = useState({
    totalSpent: 0,
    totalPaid: 0,
    dueBalance: 0,
    recentPurchases: [],
    recentPayments: [],
  });
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchData = async () => {
    const token = localStorage.getItem("token");
    if (!token) return router.push("/customer/login");
    const headers = { Authorization: `Bearer ${token}` };

    try {
      const [profileRes, dashboardRes, wishlistRes] = await Promise.all([
        fetch("/api/customer-auth/profile", { headers }).then((r) => r.json()),
        fetch("/api/customer-auth/dashboard", { headers }).then((r) => r.json()),
        fetch("/api/customer-auth/wishlist", { headers }).then((r) => r.json()),
      ]);

      setProfile(profileRes);
      setDashboard({
        totalSpent: dashboardRes.totalSpent || 0,
        totalPaid: dashboardRes.totalPaid || 0,
        dueBalance: dashboardRes.dueBalance || 0,
        recentPurchases: dashboardRes.recentPurchases || [],
        recentPayments: dashboardRes.recentPayments || [],
      });
      setWishlist(wishlistRes.wishlist || []);
    } catch {
      router.push("/customer/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 90000);
    return () => clearInterval(interval);
  }, [router]);

  const logout = () => {
    localStorage.removeItem("token");
    router.push("/customer/login");
  };

  const initials = (name) =>
    name
      ? name
          .split(" ")
          .map((w) => w[0])
          .join("")
          .slice(0, 2)
          .toUpperCase()
      : "??";

  const isVerified = profile?.account?.status === "verified" && profile?.customer;

  const handleWishlistQuantityChange = async (itemId, quantity) => {
    const token = localStorage.getItem("token");
    if (!token) return router.push("/customer/login");

    try {
      const res = await fetch("/api/customer-auth/wishlist", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ itemId, quantity }),
      });

      const data = await res.json();
      if (data?.success && Array.isArray(data.wishlist)) {
        setWishlist(data.wishlist);
      }
    } catch {
      router.push("/customer/login");
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen text-sm text-gray-400">Loading dashboard...</div>;
  if (!profile) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Header
        profile={profile}
        initials={initials}
        isVerified={isVerified}
        onProfileClick={() => router.push("/customer/profile")}
        onLogout={logout}
      />
      <main className="max-w-4xl mx-auto px-6 py-6 space-y-5">
        <Alerts dueBalance={dashboard.dueBalance} isVerified={isVerified} />
        <Stats dashboard={dashboard} />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card title="Monthly spending"><BarChart purchases={dashboard.recentPurchases} /></Card>
          <Card title="Recent payments"><PaymentsList recentPayments={dashboard.recentPayments} /></Card>
        </div>

        <Card title="Recent purchases"><PurchasesTable recentPurchases={dashboard.recentPurchases} /></Card>
        <Card title="My Wishlist"><WishlistList items={wishlist} onQuantityChange={handleWishlistQuantityChange} /></Card>
      </main>
    </div>
  );
}