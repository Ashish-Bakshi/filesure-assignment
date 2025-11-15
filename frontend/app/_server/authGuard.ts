import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function requireUser() {
  const cookieHeader = cookies().toString();
  // const accessToken = cookieStore.get("accessToken");

  if (!cookieHeader.includes("accessToken")) {
    redirect("/login");
  }

  // Validate token via backend
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
    method: "GET",
    credentials: "include",
    headers: {
      Cookie: cookieHeader,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    redirect("/login");
  }

  const data = await res.json();
  return data.data;
}
