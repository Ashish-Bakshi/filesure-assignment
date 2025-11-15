"use client";

import { useDashboard } from "@/lib/useDashboard";

export default function DashboardPage() {
  const { loading, dashboard, error } = useDashboard();

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;
  if (!dashboard) return <div className="p-6">No data</div>;

  const {
    referralCode,
    referralLink,
    totalReferred,
    convertedCount,
    pendingCount,
    totalCredits,
    referredUsers,
  } = dashboard;

  const copyLink = async () => {
    await navigator.clipboard.writeText(referralLink);
    alert("Referral link copied!");
  };

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold">Your Dashboard</h1>

      {/* Referral Information */}
      <div className="p-4 bg-white shadow rounded-xl">
        <h2 className="text-xl font-semibold mb-3">Referral Link</h2>

        <div className="flex items-center gap-2">
          <input
            type="text"
            readOnly
            value={referralLink}
            className="w-full border p-2 rounded"
          />
          <button
            onClick={copyLink}
            className="bg-black text-white px-4 py-2 rounded"
          >
            Copy
          </button>
        </div>

        <p className="text-sm text-gray-500 mt-2">
          Your code: <span className="font-semibold">{referralCode}</span>
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Referred" value={totalReferred} />
        <StatCard label="Converted Users" value={convertedCount} />
        <StatCard label="Pending Referrals" value={pendingCount} />
        <StatCard label="Credits Earned" value={totalCredits} />
      </div>

      {/* Referred Users Table */}
      <div className="bg-white p-4 shadow rounded-xl">
        <h2 className="text-xl font-semibold mb-3">Referred Users</h2>

        {referredUsers.length === 0 ? (
          <p className="text-gray-600">No referred users yet.</p>
        ) : (
          <table className="w-full text-left border">
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

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white shadow p-4 rounded-xl text-center">
      <p className="text-gray-600">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
