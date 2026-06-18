"use client";

import { Button, Form, Input, Label, TextField } from "@heroui/react";
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

type FormValues = Omit<TestimonialDto, "id">;
const empty: FormValues = { slug: "", name: "", role: "", company: "", content: "", contentFa: "", avatarUrl: null, sortOrder: 0, published: true };

export function AdminTestimonialForm({ mode, slug }: { mode: "create" | "edit"; slug?: string }) {
  const { t } = useTranslation();
  const token = useAppSelector(tokenSelector);
  const router = useRouter();
  const [initial, setInitial] = useState(empty);
  const [loading, setLoading] = useState(mode === "edit");

  useEffect(() => {
    if (mode !== "edit" || !slug || !token) return;
    void adminGet<TestimonialDto>(token, `/admin/testimonials/${slug}`)
      .then((data) => {
        const { id: _id, ...rest } = data;
        setInitial({ ...rest, contentFa: rest.contentFa ?? "", published: rest.published ?? true });
      })
      .finally(() => setLoading(false));
  }, [mode, slug, token]);

  async function onSubmit(values: FormValues, helpers: FormikHelpers<FormValues>) {
    if (!token) return;
    try {
      const body = toTestimonialPayload(values);
      if (mode === "create") await adminCreate(token, "/admin/testimonials", body);
      else if (slug) await adminUpdate(token, `/admin/testimonials/${slug}`, body);
      toast.success(t("admin.saved"));
      router.push(PATHS.ADMIN_TESTIMONIALS);
    } catch (err) {
      const parsed = parseApiError(err);
      if (!applyApiErrorsToFormik(parsed, helpers)) toast.error(parsed.message);
    } finally {
      helpers.setSubmitting(false);
    }
  }

  if (loading) return <p className="text-sm text-foreground/60">{t("admin.loading")}</p>;

  return (
    <Formik initialValues={initial} validationSchema={testimonialFormSchema} enableReinitialize onSubmit={onSubmit}>
      {({ values, handleSubmit, isSubmitting, setFieldValue }) => (
        <Form onSubmit={handleSubmit} className="mx-auto max-w-2xl space-y-4">
          <h1 className="text-2xl font-bold">{mode === "create" ? t("admin.newTestimonial") : t("admin.editTestimonial")}</h1>
          <TextField value={values.slug} variant="secondary" fullWidth onChange={(v) => void setFieldValue("slug", String(v ?? ""))}>
            <Label className="text-sm font-semibold">{t("common.slug")}</Label>
            <Input />
          </TextField>
          {(["name", "role", "company"] as const).map((f) => (
            <TextField key={f} value={String(values[f])} variant="secondary" fullWidth onChange={(v) => void setFieldValue(f, String(v ?? ""))}>
              <Label className="text-sm font-semibold capitalize">{f}</Label>
              <Input />
            </TextField>
          ))}
          <AdminDualLocaleFields enName="content" faName="contentFa" enLabel={t("admin.content")} values={values} setFieldValue={setFieldValue} multiline />
          <AdminImageField label={t("admin.avatar")} value={values.avatarUrl} onChange={(p) => void setFieldValue("avatarUrl", p)} token={token} />
          <AdminPublishedField
            checked={Boolean(values.published)}
            onChange={(v) => void setFieldValue("published", v)}
          />
          <Button type="submit" variant="primary" isPending={isSubmitting} isDisabled={isSubmitting}>{t("admin.save")}</Button>
        </Form>
      )}
    </Formik>
  );
}
