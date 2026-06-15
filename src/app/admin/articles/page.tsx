"use client";

import { AdminResourceList } from "@/components/admin/AdminResourceList";
import { PATHS } from "@/common/constants";
import { useTranslation } from "@/common/i18n/useTranslation";

export default function Page() {
  const { t } = useTranslation();
  return (
    <AdminResourceList
      title={t("admin.articles")}
      description={t("admin.articles")}
      apiPath="/admin/articles"
      newPath={PATHS.ADMIN_ARTICLE_NEW}
      editPath={PATHS.ADMIN_ARTICLE_EDIT}
    />
  );
}
