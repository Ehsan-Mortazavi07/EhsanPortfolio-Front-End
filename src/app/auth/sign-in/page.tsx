import { Suspense } from "react";
import { SignInPage } from "@/components/pages/auth/SignInPage";

export const metadata = { title: "Sign In" };

export default function Page() {
  return (
    <Suspense fallback={null}>
      <SignInPage />
    </Suspense>
  );
}
