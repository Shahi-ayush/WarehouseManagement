"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function CustomerProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [profile, setProfile] = useState(null);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [deletePassword, setDeletePassword] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    currentPassword: "",
    newPassword: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/customer/login");
        return;
      }

      try {
        const response = await fetch("/api/customer-auth/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 401) {
          localStorage.removeItem("token");
          router.push("/customer/login");
          return;
        }

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data?.error || "Failed to load profile");
        }

        setProfile(data);
        setFormData({
          name: data?.customer?.name || "",
          address: data?.customer?.address || "",
          currentPassword: "",
          newPassword: "",
        });
      } catch (error) {
        setMessage({
          type: "error",
          text: error.message || "Unable to load profile",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (message.text) {
      setMessage({ type: "", text: "" });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setMessage({ type: "", text: "" });

    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/customer/login");
      return;
    }

    try {
      const response = await fetch("/api/customer-auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          address: formData.address,
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }),
      });

      if (response.status === 401) {
        const data = await response.json();
        setMessage({
          type: "error",
          text: data?.error || "Unauthorized",
        });
        localStorage.removeItem("token");
        router.push("/customer/login");
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Failed to update profile");
      }

      setProfile((prev) => ({
        ...prev,
        customer: {
          ...prev?.customer,
          name: formData.name,
          address: formData.address,
        },
      }));

      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
      }));

      setMessage({
        type: "success",
        text: data?.message || "Profile updated successfully",
      });
    } catch (error) {
      setMessage({
        type: "error",
        text: error.message || "Failed to update profile",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteAccount = async (event) => {
    event.preventDefault();
    setDeleting(true);
    setMessage({ type: "", text: "" });

    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/customer/login");
      return;
    }

    try {
      const response = await fetch("/api/customer-auth/profile", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: deletePassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Failed to delete account");
      }

      setMessage({
        type: "success",
        text: data?.message || "Account deleted successfully",
      });

      localStorage.removeItem("token");
      router.push("/customer/login");
    } catch (error) {
      setMessage({
        type: "error",
        text: error.message || "Failed to delete account",
      });
    } finally {
      setDeleting(false);
    }
  };

  const initials = (name) =>
    name
      ? name
          .split(" ")
          .map((word) => word[0])
          .join("")
          .slice(0, 2)
          .toUpperCase()
      : "??";

  const isVerified = profile?.account?.status === "verified" && profile?.customer;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-sm text-gray-400">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <header className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-950 flex items-center justify-center text-xl">
            👤
          </div>
          <div>
            <p className="text-base font-medium text-gray-900 dark:text-gray-100">
              Profile Settings
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              {profile?.account?.email || "Customer account"}
            </p>
          </div>
        </div>

        <button
          type="button"
          disabled={submitting || deleting}
          onClick={() => router.push("/customer/dashboard")}
          className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-60"
        >
          Back to Dashboard
        </button>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-6">
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700 flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center text-lg font-medium text-gray-500">
              {initials(profile?.customer?.name || "")}
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {profile?.customer?.name || "Customer"}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {profile?.account?.phone || "No phone number"}
              </p>
              <span
                className={`inline-flex mt-2 text-[11px] px-2 py-0.5 rounded-full font-medium ${
                  isVerified
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                    : "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300"
                }`}
              >
                {isVerified ? "Verified" : "Unverified"}
              </span>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {message.text && (
              <div
                className={`rounded-xl border px-4 py-3 text-sm ${
                  message.type === "success"
                    ? "bg-green-50 border-green-200 text-green-700 dark:bg-green-950 dark:border-green-800 dark:text-green-300"
                    : "bg-red-50 border-red-200 text-red-700 dark:bg-red-950 dark:border-red-800 dark:text-red-300"
                }`}
              >
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 px-4 py-3 text-sm text-gray-900 dark:text-gray-100 outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 px-4 py-3 text-sm text-gray-900 dark:text-gray-100 outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your location"
                    required
                  />
                </div>

                <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                    Change Password
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                    Leave these fields blank if you do not want to update your password.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                        Current Password
                      </label>
                      <input
                        type="password"
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 px-4 py-3 text-sm text-gray-900 dark:text-gray-100 outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter current password"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                        New Password
                      </label>
                      <input
                        type="password"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 px-4 py-3 text-sm text-gray-900 dark:text-gray-100 outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter new password"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="submit"
                  disabled={submitting || deleting}
                  className="inline-flex items-center justify-center rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-medium px-5 py-3 transition-colors"
                >
                  {submitting ? "Saving Changes..." : "Save Changes"}
                </button>

                <button
                  type="button"
                  disabled={submitting || deleting}
                  onClick={() => router.push("/customer/dashboard")}
                  className="inline-flex items-center justify-center rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 px-5 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-60"
                >
                  Back to Dashboard
                </button>
              </div>
            </form>

            <form
              onSubmit={handleDeleteAccount}
              className="border border-red-200 dark:border-red-900 bg-red-50/70 dark:bg-red-950/40 rounded-2xl p-5 space-y-4"
            >
              <div>
                <h2 className="text-base font-semibold text-red-700 dark:text-red-300">
                  Delete Account
                </h2>
                <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                  This will permanently delete your account and linked customer profile. This action cannot be undone.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-red-700 dark:text-red-300 mb-2">
                  Confirm Current Password
                </label>
                <input
                  type="password"
                  value={deletePassword}
                  onChange={(event) => {
                    setDeletePassword(event.target.value);
                    if (message.text) {
                      setMessage({ type: "", text: "" });
                    }
                  }}
                  className="w-full rounded-xl border border-red-200 dark:border-red-800 bg-white dark:bg-gray-950 px-4 py-3 text-sm text-gray-900 dark:text-gray-100 outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Enter current password to delete account"
                  required
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  disabled={submitting || deleting}
                  className="inline-flex items-center justify-center rounded-xl bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white text-sm font-medium px-5 py-3 transition-colors"
                >
                  {deleting ? "Deleting Account..." : "Delete Account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
