import { Suspense } from "react";
import RegisterPageClient from "./loginClient";
import LoginPageClient from "./loginClient";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginPageClient />
    </Suspense>
  );
}
