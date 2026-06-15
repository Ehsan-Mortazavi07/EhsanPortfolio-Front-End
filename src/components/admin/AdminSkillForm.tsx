"use client";

import { Button, Checkbox, FieldError, Form, Input, Label, TextField } from "@heroui/react";
import { Formik, FormikHelpers } from "formik";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { adminCreate, adminGet, adminUpdate } from "@/common/api/admin";
import { PATHS } from "@/common/constants";
import type { SkillDto } from "@/common/interfaces";
import { applyApiErrorsToFormik, parseApiError } from "@/common/utils";
import { toast } from "@/common/utils/toast";
import { skillFormSchema, toSkillPayload } from "@/common/validators";
import { useTranslation } from "@/common/i18n/useTranslation";
import { tokenSelector } from "@/stores/auth/selectors";
import { useAppSelector } from "@/stores/hooks";

type FormValues = Omit<SkillDto, "id">;
const empty: FormValues = { slug: "", name: "", category: "frontend", sortOrder: 0, published: true };

export function AdminSkillForm({ mode, slug }: { mode: "create" | "edit"; slug?: string }) {
  const { t } = useTranslation();
  const token = useAppSelector(tokenSelector);
  const router = useRouter();
  const [initial, setInitial] = useState(empty);
  const [loading, setLoading] = useState(mode === "edit");

  useEffect(() => {
    if (mode !== "edit" || !slug || !token) return;
    void adminGet<SkillDto>(token, `/admin/skills/${slug}`).then((data) => {
      const { id: _id, ...rest } = data;
      setInitial({ ...rest, published: rest.published ?? true });
    }).finally(() => setLoading(false));
  }, [mode, slug, token]);

  async function onSubmit(values: FormValues, helpers: FormikHelpers<FormValues>) {
    if (!token) return;
    try {
      const body = toSkillPayload(values);
      if (mode === "create") await adminCreate(token, "/admin/skills", body);
      else if (slug) await adminUpdate(token, `/admin/skills/${slug}`, body);
      toast.success("Saved");
      router.push(PATHS.ADMIN_SKILLS);
    } catch (err) {
      const parsed = parseApiError(err);
      if (!applyApiErrorsToFormik(parsed, helpers)) toast.error(parsed.message);
    } finally {
      helpers.setSubmitting(false);
    }
  }

  if (loading) return <p className="text-sm text-foreground/60">Loading…</p>;

  return (
    <Formik initialValues={initial} validationSchema={skillFormSchema} enableReinitialize onSubmit={onSubmit}>
      {({ values, handleSubmit, isSubmitting, setFieldValue }) => (
        <Form onSubmit={handleSubmit} className="mx-auto max-w-2xl space-y-4">
          <h1 className="text-2xl font-bold">{mode === "create" ? "New Skill" : "Edit Skill"}</h1>
          {(["slug", "name", "category"] as const).map((f) => (
            <TextField key={f} value={String(values[f])} variant="secondary" fullWidth onChange={(v) => void setFieldValue(f, String(v ?? ""))}>
              <Label className="text-sm font-semibold capitalize">{f}</Label>
              <Input />
            </TextField>
          ))}
          <Checkbox isSelected={values.published ?? true} onChange={(v) => void setFieldValue("published", v)}>{t("admin.published")}</Checkbox>
          <Button type="submit" variant="primary" isPending={isSubmitting} isDisabled={isSubmitting}>Save</Button>
        </Form>
      )}
    </Formik>
  );
}
