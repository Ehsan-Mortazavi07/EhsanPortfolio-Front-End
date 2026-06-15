"use client";

import { Button, Checkbox, FieldError, Form, Input, Label, TextField } from "@heroui/react";
import { Formik, FormikHelpers } from "formik";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { adminCreate, adminGet, adminUpdate } from "@/common/api/admin";
import { PATHS } from "@/common/constants";
import type { ServiceDto } from "@/common/interfaces";
import { useTranslation } from "@/common/i18n/useTranslation";
import { applyApiErrorsToFormik, parseApiError } from "@/common/utils";
import { toast } from "@/common/utils/toast";
import { serviceFormSchema, toServicePayload } from "@/common/validators";
import { AdminDualLocaleFields } from "@/components/admin/AdminDualLocaleFields";
import { AdminIconField } from "@/components/admin/AdminIconField";
import { tokenSelector } from "@/stores/auth/selectors";
import { useAppSelector } from "@/stores/hooks";

type Mode = "create" | "edit";
type FormValues = Omit<ServiceDto, "id">;

const empty: FormValues = {
  slug: "",
  title: "",
  titleFa: "",
  description: "",
  descriptionFa: "",
  icon: "",
  highlighted: false,
  sortOrder: 0,
  published: true,
};

export function AdminServiceForm({ mode, slug }: { mode: Mode; slug?: string }) {
  const { t } = useTranslation();
  const token = useAppSelector(tokenSelector);
  const router = useRouter();
  const [initial, setInitial] = useState(empty);
  const [loading, setLoading] = useState(mode === "edit");

  useEffect(() => {
    if (mode !== "edit" || !slug || !token) return;
    void adminGet<ServiceDto>(token, `/admin/services/${slug}`)
      .then((data) => {
        const { id: _id, ...rest } = data;
        setInitial({
          ...rest,
          titleFa: rest.titleFa ?? "",
          descriptionFa: rest.descriptionFa ?? "",
          icon: rest.icon ?? "",
          published: rest.published ?? true,
        });
      })
      .catch((e) => toast.error(String(e)))
      .finally(() => setLoading(false));
  }, [mode, slug, token]);

  async function onSubmit(values: FormValues, helpers: FormikHelpers<FormValues>) {
    if (!token) return;
    try {
      const body = toServicePayload(values);
      if (mode === "create") await adminCreate(token, "/admin/services", body);
      else if (slug) await adminUpdate(token, `/admin/services/${slug}`, body);
      toast.success(t("admin.saved"));
      router.push(PATHS.ADMIN_SERVICES);
    } catch (err) {
      const parsed = parseApiError(err);
      if (!applyApiErrorsToFormik(parsed, helpers)) toast.error(parsed.message);
    } finally {
      helpers.setSubmitting(false);
    }
  }

  if (loading) return <p className="text-sm text-foreground/60">{t("admin.loading")}</p>;

  return (
    <Formik initialValues={initial} validationSchema={serviceFormSchema} enableReinitialize onSubmit={onSubmit}>
      {({ values, errors, touched, handleSubmit, isSubmitting, setFieldValue, setFieldTouched }) => (
        <Form onSubmit={handleSubmit} className="mx-auto max-w-2xl space-y-4">
          <h1 className="text-2xl font-bold">{mode === "create" ? t("admin.newService") : t("admin.editService")}</h1>
          <TextField value={values.slug} variant="secondary" fullWidth isInvalid={Boolean(touched.slug && errors.slug)} onBlur={() => setFieldTouched("slug", true)} onChange={(v) => void setFieldValue("slug", String(v ?? ""))}>
            <Label className="text-sm font-semibold">{t("common.slug")}</Label>
            <Input />
            {touched.slug && errors.slug ? <FieldError>{String(errors.slug)}</FieldError> : null}
          </TextField>
          <AdminDualLocaleFields enName="title" faName="titleFa" enLabel={t("common.name")} values={values} errors={errors} touched={touched} setFieldValue={setFieldValue} setFieldTouched={setFieldTouched} required />
          <AdminIconField
            label={t("admin.serviceIcon")}
            value={values.icon || null}
            onChange={(p) => void setFieldValue("icon", p ?? "")}
            token={token}
          />
          <AdminDualLocaleFields enName="description" faName="descriptionFa" enLabel={t("admin.description")} values={values} setFieldValue={setFieldValue} multiline />
          <Checkbox isSelected={values.highlighted} onChange={(v) => void setFieldValue("highlighted", v)}>{t("admin.highlighted")}</Checkbox>
          <Checkbox isSelected={values.published ?? true} onChange={(v) => void setFieldValue("published", v)}>{t("admin.published")}</Checkbox>
          <div className="flex gap-3">
            <Button type="submit" variant="primary" isPending={isSubmitting} isDisabled={isSubmitting}>{t("admin.save")}</Button>
            <Button variant="ghost" onPress={() => router.push(PATHS.ADMIN_SERVICES)}>{t("admin.cancel")}</Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
