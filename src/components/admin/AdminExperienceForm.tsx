"use client";

import { Button, Form } from "@heroui/react";
import { Formik, FormikHelpers } from "formik";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { adminCreate, adminGet, adminUpdate } from "@/common/api/admin";
import { PATHS } from "@/common/constants";
import type { ExperienceDto } from "@/common/interfaces";
import { useTranslation } from "@/common/i18n/useTranslation";
import { applyApiErrorsToFormik, parseApiError } from "@/common/utils";
import { toast } from "@/common/utils/toast";
import { experienceFormSchema, toExperiencePayload } from "@/common/validators";
import { AdminDualLocaleFields } from "@/components/admin/AdminDualLocaleFields";
import { AdminCheckboxField } from "@/components/admin/AdminCheckboxField";
import { AdminPublishedField } from "@/components/admin/AdminPublishedField";
import { tokenSelector } from "@/stores/auth/selectors";
import { useAppSelector } from "@/stores/hooks";

type FormValues = Omit<ExperienceDto, "id" | "slug">;
const empty: FormValues = { company: "", companyFa: "", role: "", roleFa: "", period: "", periodFa: "", description: "", descriptionFa: "", current: false, sortOrder: 0, published: true };

export function AdminExperienceForm({ mode, slug }: { mode: "create" | "edit"; slug?: string }) {
  const { t, locale } = useTranslation();
  const token = useAppSelector(tokenSelector);
  const router = useRouter();
  const [initial, setInitial] = useState(empty);
  const [loading, setLoading] = useState(mode === "edit");

  useEffect(() => {
    if (mode !== "edit" || !slug || !token) return;
    void adminGet<ExperienceDto>(token, `/admin/experience/${slug}`)
      .then((data) => {
        const { id: _id, slug: _slug, ...rest } = data;
        setInitial({
          ...rest,
          companyFa: rest.companyFa ?? "",
          roleFa: rest.roleFa ?? "",
          periodFa: rest.periodFa ?? "",
          descriptionFa: rest.descriptionFa ?? "",
          published: rest.published ?? true,
        });
      })
      .catch((err) => toast.error(parseApiError(err, locale).message))
      .finally(() => setLoading(false));
  }, [mode, slug, token, locale]);

  async function onSubmit(values: FormValues, helpers: FormikHelpers<FormValues>) {
    if (!token) return;
    try {
      const body = toExperiencePayload(values);
      if (mode === "create") await adminCreate(token, "/admin/experience", body);
      else if (slug) await adminUpdate(token, `/admin/experience/${slug}`, body);
      toast.success(t("admin.saved"));
      router.push(PATHS.ADMIN_EXPERIENCE);
    } catch (err) {
      const parsed = parseApiError(err, locale);
      if (!applyApiErrorsToFormik(parsed, helpers)) toast.error(parsed.message);
    } finally {
      helpers.setSubmitting(false);
    }
  }

  if (loading) return <p className="text-sm text-foreground/60">{t("admin.loading")}</p>;

  return (
    <Formik initialValues={initial} validationSchema={experienceFormSchema} enableReinitialize onSubmit={onSubmit}>
      {({ values, errors, touched, handleSubmit, isSubmitting, setFieldValue, setFieldTouched }) => (
        <Form onSubmit={handleSubmit} className="mx-auto max-w-2xl space-y-4">
          <h1 className="text-2xl font-bold">{mode === "create" ? t("admin.newExperience") : t("admin.editExperience")}</h1>
          <AdminDualLocaleFields enName="company" faName="companyFa" enLabel={t("admin.company")} values={values} errors={errors} touched={touched} setFieldValue={setFieldValue} setFieldTouched={setFieldTouched} required />
          <AdminDualLocaleFields enName="role" faName="roleFa" enLabel={t("admin.role")} values={values} errors={errors} touched={touched} setFieldValue={setFieldValue} setFieldTouched={setFieldTouched} required />
          <AdminDualLocaleFields enName="period" faName="periodFa" enLabel={t("admin.period")} values={values} errors={errors} touched={touched} setFieldValue={setFieldValue} setFieldTouched={setFieldTouched} required />
          <AdminDualLocaleFields enName="description" faName="descriptionFa" enLabel={t("admin.description")} values={values} errors={errors} touched={touched} setFieldValue={setFieldValue} setFieldTouched={setFieldTouched} multiline required />
          <AdminCheckboxField
            label={t("admin.currentRole")}
            checked={Boolean(values.current)}
            onChange={(v) => void setFieldValue("current", v)}
          />
          <AdminPublishedField
            checked={Boolean(values.published)}
            onChange={(v) => void setFieldValue("published", v)}
          />
          <div className="flex gap-3">
            <Button type="submit" variant="primary" isPending={isSubmitting} isDisabled={isSubmitting}>{t("admin.save")}</Button>
            <Button variant="ghost" onPress={() => router.push(PATHS.ADMIN_EXPERIENCE)}>{t("admin.cancel")}</Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
