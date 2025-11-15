import DashboardClient  from "./dashboardClient";
import { requireUser } from "@/app/_server/authGuard";


export default async function DashboardPage() {
  const user = await requireUser(); 

  return (
    <DashboardClient user={user} />
  );

}
