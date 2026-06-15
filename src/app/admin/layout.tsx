import { AdminGuardClient } from "@/components/admin/AdminGuardClient";
import { AdminLayoutShell } from "@/components/admin/AdminLayoutShell";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminGuardClient>
      <AdminLayoutShell>{children}</AdminLayoutShell>
    </AdminGuardClient>
  );
}
