"use client";

import { useDashboard } from "@/lib/useDashboard";
import { useRouter } from "next/navigation";
import { useAuth } from "@/store/useAuth";
import { useEffect } from "react";
import { logout } from "@/lib/logout";
import { useToast } from "@/store/useToast";
import { motion } from "framer-motion";


export default function DashboardClient({ user }: { user: any }) {
  const router = useRouter();
  const addToast = useToast((s) => s.addToast);
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
    addToast("Logged out!", "success");
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
    addToast("Referral link copied!", "success");

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
        addToast("Purchase failed", "error");
        return;
      }

      addToast("Purchase successful!", "success");
      location.reload(); // Refresh dashboard
    } catch (err) {
      addToast("Purchase failed", "error");
    }
  };

  return (
    <div className="p-8 space-y-10 max-w-4xl mx-auto">


      {/* PURCHASE CARD */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.35 }}
        className="p-6 bg-white rounded-xl shadow border space-y-3"
      >
        <h2 className="text-xl font-semibold">Buy a Product</h2>
        <p className="text-gray-600">
          Simulate a product purchase. First purchase triggers referral rewards.
        </p>

        <button
          onClick={handlePurchase}
          className="bg-black text-white px-4 py-2 rounded cursor-pointer hover:bg-gray-800"
        >
          Buy Product (₹10)
        </button>
      </motion.div>

      {/* REFERRAL LINK */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="p-6 bg-white rounded-xl shadow border space-y-4"
      >
        <h2 className="text-xl font-semibold">Referral Link</h2>

        <div className="flex items-center gap-2">
          <input
            value={referralLink}
            readOnly
            className="w-full border p-2 rounded"
          />
          <button
            onClick={copyReferralLink}
            className="bg-black text-white px-4 py-2 rounded cursor-pointer hover:bg-gray-800"
          >
            Copy
          </button>
        </div>

        <p className="text-gray-600 text-sm">
          Your referral code:{" "}
          <span className="font-semibold">{referralCode}</span>
        </p>
      </motion.div>

      {/* STAT CARDS */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.08,
            },
          },
        }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {[
          { label: "Total Referred", value: totalReferred },
          { label: "Converted Users", value: convertedCount },
          { label: "Pending Referrals", value: pendingCount },
          { label: "Credits Earned", value: totalCredits },
        ].map((stat, idx) => (
          <motion.div
            key={idx}
            variants={{
              hidden: { opacity: 0, y: 15 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            <StatCard label={stat.label} value={stat.value} />
          </motion.div>
        ))}
      </motion.div>

      {/* REFERRED USERS TABLE */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="p-6 bg-white rounded-xl shadow border mt-8"
      >
        <h2 className="text-xl font-semibold mb-4">Referred Users</h2>

        {referredUsers.length === 0 ? (
          <p className="text-gray-600">No referrals yet.</p>
        ) : (
          <table className="w-full border text-left rounded-lg overflow-hidden">
            <thead>
              <tr className="border-b bg-gray-100">
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Status</th>
                <th className="p-3">Credits</th>
              </tr>
            </thead>

            <tbody>
              {referredUsers.map((u: any, index: number) => (
                <motion.tr
                  key={u.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: index * 0.05 }}
                  className="border-b hover:bg-gray-50"
                >
                  <td className="p-3">{u.name}</td>
                  <td className="p-3">{u.email}</td>

                  <td className="p-3">
                    <span
                      className={`
                  px-2 py-1 text-xs font-medium rounded-full
                  ${u.referralStatus === "converted"
                          ? "bg-green-100 text-green-700"
                          : u.referralStatus === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-gray-100 text-gray-700"
                        }
                `}
                    >
                      {u.referralStatus}
                    </span>
                  </td>

                  <td className="p-3">{u.credits}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        )}
      </motion.div>

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
