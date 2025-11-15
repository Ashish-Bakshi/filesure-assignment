import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function LandingPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken");

  if (token) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-6">
      <div className="text-center space-y-6 w-full max-w-xl">

        <h1 className="text-4xl md:text-5xl font-bold">
          Welcome to FileSure Referral System
        </h1>

        <p className="text-gray-600 text-lg">
          Earn rewards by referring users. Track your referrals and credits in your dashboard.
        </p>

        <div className="flex items-center justify-center gap-4 mt-6">
          <a
            href="/login"
            className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800"
          >
            Login
          </a>

          <a
            href="/register"
            className="px-6 py-3 border border-black text-black rounded-lg hover:bg-gray-200"
          >
            Register
          </a>
        </div>
      </div>
    </div>
  );
}
