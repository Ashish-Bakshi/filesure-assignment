import DashboardClient  from "./dashboardClient";
import { requireUser } from "@/app/_server/authGuard";
import { Suspense } from "react";

export default async function DashboardPage() {
  const user = await requireUser(); 

  return (
    <Suspense fallback={<div className="p-8">Loading…</div>}>
    <DashboardClient user={user} />
    </Suspense>
  );

}
