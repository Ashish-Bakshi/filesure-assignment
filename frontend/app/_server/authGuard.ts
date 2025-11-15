'use server'

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function requireUser() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken");

  if (!accessToken) {
    redirect("/login");
  }

  // Validate token via backend
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
    method: "GET",
    credentials: "include",
    headers: {
      Cookie: `accessToken=${accessToken.value}`,
    },
  });

  if (!res.ok) {
    redirect("/login");
  }

  const data = await res.json();
  return data.data;
}
