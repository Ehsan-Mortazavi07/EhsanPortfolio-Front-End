"use client";

import { AdminResourceList } from "@/components/admin/AdminResourceList";
import { PATHS } from "@/common/constants";
import { useTranslation } from "@/common/i18n/useTranslation";

export default function Page() {
  const { t } = useTranslation();
  return (
    <AdminResourceList
      title={t("admin.services")}
      description={t("admin.services")}
      apiPath="/admin/services"
      newPath={PATHS.ADMIN_SERVICE_NEW}
      editPath={PATHS.ADMIN_SERVICE_EDIT}
    />
  );
}
