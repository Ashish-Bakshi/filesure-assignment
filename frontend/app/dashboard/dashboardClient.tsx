"use client";

import { useDashboard } from "@/lib/useDashboard";
import { useRouter } from "next/navigation";
import { useAuth } from "@/store/useAuth";
import { useEffect } from "react";
import { logout } from "@/lib/logout";

export default function DashboardClient({ user }: { user: any }) {
  const router = useRouter();
  const { loading, dashboard, error } = useDashboard();

  const authUser = useAuth((s) => s.user);
  const setUser = useAuth((s) => s.setUser);

  // Set Zustand user initially
  useEffect(() => {
    if (!authUser) {
      setUser(user);
    }
  }, []);

  // Client-side fallback redirect
  useEffect(() => {
    if (!authUser) {
      router.push("/login");
    }
  }, [authUser]);

  const handleLogout = async () => {
    await logout();
    setUser(null);
    router.push("/login");
  };

  if (loading)
    return (
      <div className="p-8 text-lg font-medium">
        Loading dashboard…
      </div>
    );

  if (error)
    return <div className="p-8 text-red-600">{error}</div>;

  if (!dashboard)
    return <div className="p-8">No data available.</div>;

  const {
    referralCode,
    referralLink,
    totalReferred,
    convertedCount,
    pendingCount,
    totalCredits,
    referredUsers,
  } = dashboard;

  const copyReferralLink = async () => {
    await navigator.clipboard.writeText(referralLink);
    alert("Referral link copied!");
  };

  const handlePurchase = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/purchase`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId: "demo", amount: 10 }),
        }
      );

      if (!res.ok) {
        alert("Purchase failed");
        return;
      }

      alert("Purchase successful!");
      location.reload(); // Refresh dashboard
    } catch (err) {
      alert("Purchase failed");
    }
  };

  return (
    <div className="p-8 space-y-10 max-w-4xl mx-auto">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>

        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>

      {/* PURCHASE CARD */}
      <div className="p-6 bg-white rounded-xl shadow space-y-3">
        <h2 className="text-xl font-semibold">Buy a Product</h2>
        <p className="text-gray-600">
          Simulate a product purchase. First purchase triggers referral rewards.
        </p>

        <button
          onClick={handlePurchase}
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          Buy Product (₹10)
        </button>
      </div>

      {/* REFERRAL LINK */}
      <div className="p-6 bg-white rounded-xl shadow space-y-3">
        <h2 className="text-xl font-semibold">Referral Link</h2>

        <div className="flex items-center gap-2">
          <input
            value={referralLink}
            readOnly
            className="w-full border p-2 rounded"
          />
          <button
            onClick={copyReferralLink}
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
          >
            Copy
          </button>
        </div>

        <p className="text-gray-600 text-sm">
          Your referral code:{" "}
          <span className="font-semibold">{referralCode}</span>
        </p>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Referred" value={totalReferred} />
        <StatCard label="Converted Users" value={convertedCount} />
        <StatCard label="Pending Referrals" value={pendingCount} />
        <StatCard label="Credits Earned" value={totalCredits} />
      </div>

      {/* REFERRED USERS TABLE */}
      <div className="p-6 bg-white rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-3">Referred Users</h2>

        {referredUsers.length === 0 ? (
          <p className="text-gray-600">No referrals yet.</p>
        ) : (
          <table className="w-full border text-left">
            <thead>
              <tr className="border-b bg-gray-100">
                <th className="p-2">Name</th>
                <th className="p-2">Email</th>
                <th className="p-2">Status</th>
                <th className="p-2">Credits</th>
              </tr>
            </thead>

            <tbody>
              {referredUsers.map((u: any) => (
                <tr key={u.id} className="border-b">
                  <td className="p-2">{u.name}</td>
                  <td className="p-2">{u.email}</td>

                  <td className="p-2">
                    <span
                      className={
                        u.referralStatus === "converted"
                          ? "text-green-600"
                          : u.referralStatus === "pending"
                          ? "text-yellow-600"
                          : "text-gray-600"
                      }
                    >
                      {u.referralStatus}
                    </span>
                  </td>

                  <td className="p-2">{u.credits}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

    </div>
  );
}

// Small shared component
function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white shadow p-4 rounded-xl text-center">
      <p className="text-gray-600">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
