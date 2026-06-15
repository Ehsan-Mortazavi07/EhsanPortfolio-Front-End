"use client";

import { AdminResourceList } from "@/components/admin/AdminResourceList";
import { PATHS } from "@/common/constants";
import { useTranslation } from "@/common/i18n/useTranslation";

export default function Page() {
  const { t } = useTranslation();
  return (
    <AdminResourceList
      title={t("admin.testimonials")}
      description={t("admin.testimonials")}
      apiPath="/admin/testimonials"
      newPath={PATHS.ADMIN_TESTIMONIAL_NEW}
      editPath={PATHS.ADMIN_TESTIMONIAL_EDIT}
    />
  );
}
