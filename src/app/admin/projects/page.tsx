"use client";

import { AdminResourceList } from "@/components/admin/AdminResourceList";
import { PATHS } from "@/common/constants";
import { useTranslation } from "@/common/i18n/useTranslation";

export default function Page() {
  const { t } = useTranslation();
  return (
    <AdminResourceList
      title={t("admin.projects")}
      description={t("admin.projects")}
      apiPath="/admin/projects"
      newPath={PATHS.ADMIN_PROJECT_NEW}
      editPath={PATHS.ADMIN_PROJECT_EDIT}
    />
  );
}
