"use client";

import { Button, Card, Spinner } from "@heroui/react";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { PATHS } from "@/common/constants";
import { isAdminUser } from "@/common/utils/auth-user";
import { didTryAutoLoginSelector, isAuthSelector, userSelector } from "@/stores/auth/selectors";
import { useAppSelector } from "@/stores/hooks";

export function AdminGuardClient({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const isAuth = useAppSelector(isAuthSelector);
  const didTryAutoLogin = useAppSelector(didTryAutoLoginSelector);
  const user = useAppSelector(userSelector);

  useEffect(() => {
    if (!didTryAutoLogin) return;
    if (!isAuth || !user) {
      router.replace(`${PATHS.SIGN_IN}?next=${encodeURIComponent(pathname)}`);
      return;
    }
    if (!isAdminUser(user)) router.replace(PATHS.HOME);
  }, [didTryAutoLogin, isAuth, pathname, router, user]);

  if (!didTryAutoLogin || !isAuth || !user) {
    return (
      <div className="flex items-center gap-3 p-6">
        <Spinner size="sm" />
        <p className="text-sm font-medium text-foreground/60">Checking access…</p>
      </div>
    );
  }

  if (!isAdminUser(user)) {
    return (
      <Card className="m-6 max-w-md rounded-2xl p-6 ring-1 ring-border/40">
        <p className="text-sm font-semibold text-danger">You do not have admin access.</p>
        <Button variant="primary" className="mt-4 font-semibold" onPress={() => router.push(PATHS.HOME)}>
          Back to site
        </Button>
      </Card>
    );
  }

  return <>{children}</>;
}
