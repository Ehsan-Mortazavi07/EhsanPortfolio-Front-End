"use client";

import { Button, FieldError, Form, Input, Label, ListBox, Select, TextField } from "@heroui/react";
import { Formik, FormikHelpers } from "formik";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { adminCreate, adminGet, adminUpdate } from "@/common/api/admin";
import { PATHS } from "@/common/constants";
import type { SkillDto } from "@/common/interfaces";
import { applyApiErrorsToFormik, localizeErrorMessage, parseApiError } from "@/common/utils";
import { toast } from "@/common/utils/toast";
import { skillFormSchema, toSkillPayload } from "@/common/validators";
import { AdminIconField } from "@/components/admin/AdminIconField";
import { AdminPublishedField } from "@/components/admin/AdminPublishedField";
import { useTranslation } from "@/common/i18n/useTranslation";
import { tokenSelector } from "@/stores/auth/selectors";
import { useAppSelector } from "@/stores/hooks";

type FormValues = Omit<SkillDto, "id" | "slug">;
const SKILL_CATEGORIES = ["frontend", "backend", "devops", "database", "language"] as const;
const empty: FormValues = {
  name: "",
  category: "frontend",
  icon: null,
  sortOrder: 0,
  published: true,
};

export function AdminSkillForm({ mode, slug }: { mode: "create" | "edit"; slug?: string }) {
  const { t, locale } = useTranslation();
  const token = useAppSelector(tokenSelector);
  const router = useRouter();
  const [initial, setInitial] = useState(empty);
  const [loading, setLoading] = useState(mode === "edit");

  useEffect(() => {
    if (mode !== "edit" || !slug || !token) return;
    void adminGet<SkillDto>(token, `/admin/skills/${slug}`)
      .then((data) => {
        const { id: _id, slug: _slug, ...rest } = data;
        setInitial({
          ...rest,
          category: SKILL_CATEGORIES.some((category) => category === rest.category) ? rest.category : "frontend",
          icon: rest.icon ?? null,
          published: rest.published ?? true,
        });
      })
      .catch((err) => toast.error(parseApiError(err, locale).message))
      .finally(() => setLoading(false));
  }, [mode, slug, token, locale]);

  async function onSubmit(values: FormValues, helpers: FormikHelpers<FormValues>) {
    if (!token) return;
    try {
      const body = toSkillPayload(values);
      if (mode === "create") await adminCreate(token, "/admin/skills", body);
      else if (slug) await adminUpdate(token, `/admin/skills/${slug}`, body);
      toast.success(t("admin.saved"));
      router.push(PATHS.ADMIN_SKILLS);
    } catch (err) {
      const parsed = parseApiError(err, locale);
      if (!applyApiErrorsToFormik(parsed, helpers)) toast.error(parsed.message);
    } finally {
      helpers.setSubmitting(false);
    }
  }

  if (loading) return <p className="text-sm text-foreground/60">{t("admin.loading")}</p>;

  return (
    <Formik initialValues={initial} validationSchema={skillFormSchema} enableReinitialize onSubmit={onSubmit}>
      {({ values, errors, touched, handleSubmit, isSubmitting, setFieldValue, setFieldTouched }) => (
        <Form onSubmit={handleSubmit} className="mx-auto max-w-2xl space-y-4">
          <h1 className="text-2xl font-bold">{mode === "create" ? t("admin.newSkill") : t("admin.editSkill")}</h1>
          <TextField value={values.name} variant="secondary" fullWidth isInvalid={Boolean(touched.name && errors.name)} onBlur={() => setFieldTouched("name", true)} onChange={(v) => void setFieldValue("name", String(v ?? ""))}>
            <Label className="text-sm font-semibold">{t("common.name")}</Label>
            <Input />
            {touched.name && errors.name ? <FieldError>{localizeErrorMessage(String(errors.name), locale)}</FieldError> : null}
          </TextField>
          <div className="space-y-2">
            <Label className="text-sm font-semibold">{t("admin.category")}</Label>
            <Select
              aria-label={t("admin.category")}
              isInvalid={Boolean(touched.category && errors.category)}
              selectedKey={values.category}
              onSelectionChange={(key) => {
                if (typeof key === "string" && SKILL_CATEGORIES.some((category) => category === key)) {
                  void setFieldValue("category", key);
                  void setFieldTouched("category", true);
                }
              }}
              variant="secondary"
              className="admin-themed-select-control w-full"
            >
              <Select.Trigger className="admin-themed-select-trigger">
                <Select.Value />
                <Select.Indicator />
              </Select.Trigger>
              <Select.Popover className="admin-themed-select-popover">
                <ListBox>
                  {SKILL_CATEGORIES.map((category) => (
                    <ListBox.Item key={category} id={category} textValue={t(`admin.category.${category}` as const)}>
                      {t(`admin.category.${category}` as const)}
                      <ListBox.ItemIndicator>✓</ListBox.ItemIndicator>
                    </ListBox.Item>
                  ))}
                </ListBox>
              </Select.Popover>
            </Select>
            {touched.category && errors.category ? <FieldError>{localizeErrorMessage(String(errors.category), locale)}</FieldError> : null}
          </div>
          <AdminIconField
            label={t("admin.skillIcon")}
            value={values.icon ?? null}
            onChange={(p) => void setFieldValue("icon", p)}
            token={token}
          />
          <AdminPublishedField
            checked={Boolean(values.published)}
            onChange={(v) => void setFieldValue("published", v)}
          />
          <div className="flex gap-3">
            <Button type="submit" variant="primary" isPending={isSubmitting} isDisabled={isSubmitting}>
              {t("admin.save")}
            </Button>
            <Button variant="ghost" onPress={() => router.push(PATHS.ADMIN_SKILLS)}>
              {t("admin.cancel")}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
