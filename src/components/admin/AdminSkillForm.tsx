"use client";

import { Button, FieldError, Form, Input, Label, TextField } from "@heroui/react";
import { Formik, FormikHelpers } from "formik";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { adminCreate, adminGet, adminUpdate } from "@/common/api/admin";
import { PATHS } from "@/common/constants";
import type { SkillDto } from "@/common/interfaces";
import { applyApiErrorsToFormik, parseApiError } from "@/common/utils";
import { toast } from "@/common/utils/toast";
import { skillFormSchema, toSkillPayload } from "@/common/validators";
import { AdminIconField } from "@/components/admin/AdminIconField";
import { AdminPublishedField } from "@/components/admin/AdminPublishedField";
import { useTranslation } from "@/common/i18n/useTranslation";
import { tokenSelector } from "@/stores/auth/selectors";
import { useAppSelector } from "@/stores/hooks";

type FormValues = Omit<SkillDto, "id">;
const empty: FormValues = {
  slug: "",
  name: "",
  category: "frontend",
  icon: null,
  sortOrder: 0,
  published: true,
};

export function AdminSkillForm({ mode, slug }: { mode: "create" | "edit"; slug?: string }) {
  const { t } = useTranslation();
  const token = useAppSelector(tokenSelector);
  const router = useRouter();
  const [initial, setInitial] = useState(empty);
  const [loading, setLoading] = useState(mode === "edit");

  useEffect(() => {
    if (mode !== "edit" || !slug || !token) return;
    void adminGet<SkillDto>(token, `/admin/skills/${slug}`)
      .then((data) => {
        const { id: _id, ...rest } = data;
        setInitial({
          ...rest,
          icon: rest.icon ?? null,
          published: rest.published ?? true,
        });
      })
      .finally(() => setLoading(false));
  }, [mode, slug, token]);

  async function onSubmit(values: FormValues, helpers: FormikHelpers<FormValues>) {
    if (!token) return;
    try {
      const body = toSkillPayload(values);
      if (mode === "create") await adminCreate(token, "/admin/skills", body);
      else if (slug) await adminUpdate(token, `/admin/skills/${slug}`, body);
      toast.success(t("admin.saved"));
      router.push(PATHS.ADMIN_SKILLS);
    } catch (err) {
      const parsed = parseApiError(err);
      if (!applyApiErrorsToFormik(parsed, helpers)) toast.error(parsed.message);
    } finally {
      helpers.setSubmitting(false);
    }
  }

  if (loading) return <p className="text-sm text-foreground/60">{t("admin.loading")}</p>;

  return (
    <Formik initialValues={initial} validationSchema={skillFormSchema} enableReinitialize onSubmit={onSubmit}>
      {({ values, handleSubmit, isSubmitting, setFieldValue }) => (
        <Form onSubmit={handleSubmit} className="mx-auto max-w-2xl space-y-4">
          <h1 className="text-2xl font-bold">{mode === "create" ? t("admin.newSkill") : t("admin.editSkill")}</h1>
          <TextField value={values.name} variant="secondary" fullWidth onChange={(v) => void setFieldValue("name", String(v ?? ""))}>
            <Label className="text-sm font-semibold">{t("common.name")}</Label>
            <Input />
          </TextField>
          <TextField value={values.category} variant="secondary" fullWidth onChange={(v) => void setFieldValue("category", String(v ?? ""))}>
            <Label className="text-sm font-semibold">{t("admin.category")}</Label>
            <Input placeholder="frontend, backend, devops, database" />
          </TextField>
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
