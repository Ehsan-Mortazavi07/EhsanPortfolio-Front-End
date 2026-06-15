"use client";

import { AdminResourceList } from "@/components/admin/AdminResourceList";
import { PATHS } from "@/common/constants";
import { useTranslation } from "@/common/i18n/useTranslation";

export default function Page() {
  const { t } = useTranslation();
  return (
    <AdminResourceList
      title={t("admin.experience")}
      description={t("admin.experience")}
      apiPath="/admin/experience"
      newPath={PATHS.ADMIN_EXPERIENCE_NEW}
      editPath={PATHS.ADMIN_EXPERIENCE_EDIT}
    />
  );
}
