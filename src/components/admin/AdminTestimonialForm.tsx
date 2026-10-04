"use client";

import { Button, Form } from "@heroui/react";
import { Formik, FormikHelpers } from "formik";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { adminCreate, adminGet, adminUpdate } from "@/common/api/admin";
import { PATHS } from "@/common/constants";
import type { TestimonialDto } from "@/common/interfaces";
import { useTranslation } from "@/common/i18n/useTranslation";
import { applyApiErrorsToFormik, parseApiError } from "@/common/utils";
import { toast } from "@/common/utils/toast";
import { testimonialFormSchema, toTestimonialPayload } from "@/common/validators";
import { AdminDualLocaleFields } from "@/components/admin/AdminDualLocaleFields";
import { AdminPublishedField } from "@/components/admin/AdminPublishedField";
import { AdminImageField } from "@/components/admin/AdminImageField";
import { tokenSelector } from "@/stores/auth/selectors";
import { useAppSelector } from "@/stores/hooks";

type FormValues = Omit<TestimonialDto, "id" | "slug">;
const empty: FormValues = { name: "", nameFa: "", role: "", roleFa: "", company: "", companyFa: "", content: "", contentFa: "", avatarUrl: null, sortOrder: 0, published: false };

export function AdminTestimonialForm({ mode, slug }: { mode: "create" | "edit"; slug?: string }) {
  const { t, locale } = useTranslation();
  const token = useAppSelector(tokenSelector);
  const router = useRouter();
  const [initial, setInitial] = useState(empty);
  const [loading, setLoading] = useState(mode === "edit");

  useEffect(() => {
    if (mode !== "edit" || !slug || !token) return;
    void adminGet<TestimonialDto>(token, `/admin/testimonials/${slug}`)
      .then((data) => {
        const { id: _id, slug: _slug, ...rest } = data;
        setInitial({ ...rest, nameFa: rest.nameFa ?? "", roleFa: rest.roleFa ?? "", companyFa: rest.companyFa ?? "", contentFa: rest.contentFa ?? "", published: rest.published ?? false });
      })
      .catch((err) => toast.error(parseApiError(err, locale).message))
      .finally(() => setLoading(false));
  }, [mode, slug, token, locale]);

  async function onSubmit(values: FormValues, helpers: FormikHelpers<FormValues>) {
    if (!token) return;
    try {
      const body = toTestimonialPayload(values);
      if (mode === "create") await adminCreate(token, "/admin/testimonials", body);
      else if (slug) await adminUpdate(token, `/admin/testimonials/${slug}`, body);
      toast.success(t("admin.saved"));
      router.push(PATHS.ADMIN_TESTIMONIALS);
    } catch (err) {
      const parsed = parseApiError(err, locale);
      if (!applyApiErrorsToFormik(parsed, helpers)) toast.error(parsed.message);
    } finally {
      helpers.setSubmitting(false);
    }
  }

  if (loading) return <p className="text-sm text-foreground/60">{t("admin.loading")}</p>;

  return (
    <Formik initialValues={initial} validationSchema={testimonialFormSchema} enableReinitialize onSubmit={onSubmit}>
      {({ values, errors, touched, handleSubmit, isSubmitting, setFieldValue, setFieldTouched }) => (
        <Form onSubmit={handleSubmit} className="mx-auto max-w-2xl space-y-4">
          <h1 className="text-2xl font-bold">{mode === "create" ? t("admin.newTestimonial") : t("admin.editTestimonial")}</h1>
          <AdminDualLocaleFields enName="name" faName="nameFa" enLabel={t("admin.fieldName")} values={values} errors={errors} touched={touched} setFieldValue={setFieldValue} setFieldTouched={setFieldTouched} required />
          <AdminDualLocaleFields enName="role" faName="roleFa" enLabel={t("admin.role")} values={values} errors={errors} touched={touched} setFieldValue={setFieldValue} setFieldTouched={setFieldTouched} required />
          <AdminDualLocaleFields enName="company" faName="companyFa" enLabel={t("admin.company")} values={values} errors={errors} touched={touched} setFieldValue={setFieldValue} setFieldTouched={setFieldTouched} required />
          <AdminDualLocaleFields enName="content" faName="contentFa" enLabel={t("admin.content")} values={values} errors={errors} touched={touched} setFieldValue={setFieldValue} setFieldTouched={setFieldTouched} multiline required />
          <AdminImageField label={t("admin.avatar")} value={values.avatarUrl} onChange={(p) => void setFieldValue("avatarUrl", p)} token={token} />
          {mode === "create" ? (
            <p className="rounded-xl border border-border/50 bg-surface-secondary px-4 py-3 text-sm leading-6 text-foreground/70">
              {t("admin.approvalRequired")}
            </p>
          ) : (
            <AdminPublishedField
              checked={Boolean(values.published)}
              onChange={(v) => void setFieldValue("published", v)}
              labelKey="admin.approveToPublish"
              hintKey="admin.approvalRequired"
            />
          )}
          <Button type="submit" variant="primary" isPending={isSubmitting} isDisabled={isSubmitting}>{t("admin.save")}</Button>
        </Form>
      )}
    </Formik>
  );
}
