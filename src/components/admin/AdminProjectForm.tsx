"use client";

import {
  Button,
  Checkbox,
  FieldError,
  Form,
  Input,
  Label,
  TextArea,
  TextField,
} from "@heroui/react";
import { Formik, FormikHelpers } from "formik";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { adminCreate, adminGet, adminUpdate } from "@/common/api/admin";
import { PATHS } from "@/common/constants";
import type { ProjectDto } from "@/common/interfaces";
import { useTranslation } from "@/common/i18n/useTranslation";
import { applyApiErrorsToFormik, parseApiError } from "@/common/utils";
import { toast } from "@/common/utils/toast";
import { projectFormSchema, toProjectPayload } from "@/common/validators";
import { AdminDualLocaleFields } from "@/components/admin/AdminDualLocaleFields";
import { AdminImageField } from "@/components/admin/AdminImageField";
import { tokenSelector } from "@/stores/auth/selectors";
import { useAppSelector } from "@/stores/hooks";

type Mode = "create" | "edit";

type FormValues = Omit<ProjectDto, "id"> & { tagsInput: string };

const empty: FormValues = {
  slug: "",
  title: "",
  titleFa: "",
  excerpt: "",
  excerptFa: "",
  description: "",
  descriptionFa: "",
  coverImageUrl: null,
  tags: [],
  tagsInput: "",
  featured: false,
  sortOrder: 0,
  published: true,
  liveUrl: null,
  repoUrl: null,
};

export function AdminProjectForm({ mode, slug }: { mode: Mode; slug?: string }) {
  const { t } = useTranslation();
  const token = useAppSelector(tokenSelector);
  const router = useRouter();
  const [initial, setInitial] = useState(empty);
  const [loading, setLoading] = useState(mode === "edit");

  useEffect(() => {
    if (mode !== "edit" || !slug || !token) return;
    void (async () => {
      try {
        const data = await adminGet<ProjectDto>(token, `/admin/projects/${slug}`);
        setInitial({
          slug: data.slug,
          title: data.title,
          titleFa: data.titleFa ?? "",
          excerpt: data.excerpt,
          excerptFa: data.excerptFa ?? "",
          description: data.description,
          descriptionFa: data.descriptionFa ?? "",
          coverImageUrl: data.coverImageUrl,
          tags: data.tags,
          tagsInput: data.tags.join(", "),
          featured: data.featured,
          sortOrder: data.sortOrder,
          published: data.published ?? true,
          liveUrl: data.liveUrl ?? null,
          repoUrl: data.repoUrl ?? null,
        });
      } catch (err) {
        toast.error(err instanceof Error ? err.message : t("admin.loadFailed"));
      } finally {
        setLoading(false);
      }
    })();
  }, [mode, slug, token, t]);

  async function onSubmit(values: FormValues, helpers: FormikHelpers<FormValues>) {
    if (!token) return;
    try {
      const body = toProjectPayload({ ...values, tagsInput: values.tagsInput });
      if (mode === "create") {
        await adminCreate(token, "/admin/projects", body);
        toast.success(t("admin.projectCreated"));
      } else if (slug) {
        await adminUpdate(token, `/admin/projects/${slug}`, body);
        toast.success(t("admin.projectUpdated"));
      }
      router.push(PATHS.ADMIN_PROJECTS);
    } catch (err) {
      const parsed = parseApiError(err);
      if (!applyApiErrorsToFormik(parsed, helpers)) toast.error(parsed.message);
    } finally {
      helpers.setSubmitting(false);
    }
  }

  if (loading) return <p className="text-sm text-foreground/60">{t("admin.loading")}</p>;

  return (
    <Formik initialValues={initial} validationSchema={projectFormSchema} enableReinitialize onSubmit={onSubmit}>
      {({ values, errors, touched, handleSubmit, isSubmitting, setFieldValue, setFieldTouched }) => (
        <Form onSubmit={handleSubmit} className="mx-auto max-w-2xl space-y-5">
          <h1 className="text-2xl font-bold">{mode === "create" ? t("admin.newProject") : t("admin.editProject")}</h1>
          <TextField
            value={values.slug}
            variant="secondary"
            fullWidth
            isInvalid={Boolean(touched.slug && errors.slug)}
            onBlur={() => setFieldTouched("slug", true)}
            onChange={(v) => void setFieldValue("slug", String(v ?? ""))}
          >
            <Label className="text-sm font-semibold">{t("common.slug")}</Label>
            <Input />
            {touched.slug && errors.slug ? <FieldError>{String(errors.slug)}</FieldError> : null}
          </TextField>
          <AdminDualLocaleFields
            enName="title"
            faName="titleFa"
            enLabel={t("common.name")}
            values={values}
            errors={errors}
            touched={touched}
            setFieldValue={setFieldValue}
            setFieldTouched={setFieldTouched}
            required
          />
          <AdminDualLocaleFields
            enName="excerpt"
            faName="excerptFa"
            enLabel="Excerpt"
            values={values}
            errors={errors}
            touched={touched}
            setFieldValue={setFieldValue}
            setFieldTouched={setFieldTouched}
            multiline
          />
          <AdminDualLocaleFields
            enName="description"
            faName="descriptionFa"
            enLabel={t("admin.description")}
            values={values}
            errors={errors}
            touched={touched}
            setFieldValue={setFieldValue}
            setFieldTouched={setFieldTouched}
            multiline
          />
          <TextField value={values.tagsInput} variant="secondary" fullWidth onChange={(v) => void setFieldValue("tagsInput", String(v ?? ""))}>
            <Label className="text-sm font-semibold">{t("admin.tags")}</Label>
            <Input />
          </TextField>
          <AdminImageField label={t("admin.coverImage")} value={values.coverImageUrl} onChange={(p) => void setFieldValue("coverImageUrl", p)} token={token} />
          <div className="rounded-xl border border-[var(--card-border)] bg-[var(--tag-bg)] p-4 space-y-4">
            <Checkbox
              isSelected={Boolean(values.published)}
              onChange={(selected) => void setFieldValue("published", selected)}
            >
              <Checkbox.Control>
                <Checkbox.Indicator />
              </Checkbox.Control>
              <Checkbox.Content>{t("admin.published")}</Checkbox.Content>
            </Checkbox>
            <p className="text-xs text-foreground/55 ps-7">{t("admin.publishedHint")}</p>
            <Checkbox
              isSelected={Boolean(values.featured)}
              onChange={(selected) => void setFieldValue("featured", selected)}
            >
              <Checkbox.Control>
                <Checkbox.Indicator />
              </Checkbox.Control>
              <Checkbox.Content>{t("admin.featured")}</Checkbox.Content>
            </Checkbox>
          </div>
          <div className="flex gap-3">
            <Button type="submit" variant="primary" isPending={isSubmitting} isDisabled={isSubmitting}>{t("admin.save")}</Button>
            <Button variant="ghost" onPress={() => router.push(PATHS.ADMIN_PROJECTS)}>{t("admin.cancel")}</Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
