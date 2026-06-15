"use client";

import { AdminResourceList } from "@/components/admin/AdminResourceList";
import { PATHS } from "@/common/constants";
import { useTranslation } from "@/common/i18n/useTranslation";

export default function Page() {
  const { t } = useTranslation();
  return (
    <AdminResourceList
      title={t("admin.skills")}
      description={t("admin.skills")}
      apiPath="/admin/skills"
      newPath={PATHS.ADMIN_SKILL_NEW}
      editPath={PATHS.ADMIN_SKILL_EDIT}
    />
  );
}
