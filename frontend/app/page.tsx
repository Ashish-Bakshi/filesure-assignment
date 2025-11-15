import LandingPageClient from "@/components/LandingPage";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function LandingPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken");

  if (token) {
    redirect("/dashboard");
  }

  return (
    <LandingPageClient />
  );
}
