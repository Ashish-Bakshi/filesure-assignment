import { Suspense } from "react";
import RegisterPageClient from "./registerClient";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RegisterPageClient />
    </Suspense>
  );
}
