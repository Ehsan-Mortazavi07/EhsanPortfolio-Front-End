"use client";

import {
  Button,
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
import { applyApiErrorsToFormik, isSafeExternalUrl, localizeErrorMessage, parseApiError } from "@/common/utils";
import { toast } from "@/common/utils/toast";
import { projectFormSchema, toProjectPayload } from "@/common/validators";
import { AdminPublishedField } from "@/components/admin/AdminPublishedField";
import { AdminCheckboxField } from "@/components/admin/AdminCheckboxField";
import { AdminDualLocaleFields } from "@/components/admin/AdminDualLocaleFields";
import { AdminImageField } from "@/components/admin/AdminImageField";
import { AdminRichTextEditor } from "@/components/admin/AdminRichTextEditor";
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
  contentHtml: "",
  contentHtmlFa: "",
  coverImageUrl: null,
  homeImageUrl: null,
  tags: [],
  tagsInput: "",
  featured: false,
  sortOrder: 0,
  published: true,
  liveUrl: null,
  repoUrl: null,
};

export function AdminProjectForm({ mode, slug }: { mode: Mode; slug?: string }) {
  const { t, locale } = useTranslation();
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
          contentHtml: data.contentHtml ?? "",
          contentHtmlFa: data.contentHtmlFa ?? "",
          coverImageUrl: data.coverImageUrl,
          homeImageUrl: data.homeImageUrl ?? null,
          tags: data.tags,
          tagsInput: data.tags.join(", "),
          featured: data.featured,
          sortOrder: data.sortOrder,
          published: data.published ?? true,
          liveUrl: isSafeExternalUrl(data.liveUrl) ? data.liveUrl : null,
          repoUrl: isSafeExternalUrl(data.repoUrl) ? data.repoUrl : null,
        });
      } catch (err) {
        toast.error(parseApiError(err, locale).message || t("admin.loadFailed"));
      } finally {
        setLoading(false);
      }
    })();
  }, [mode, slug, token, t, locale]);

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
      const parsed = parseApiError(err, locale);
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
            {touched.slug && errors.slug ? <FieldError>{localizeErrorMessage(String(errors.slug), locale)}</FieldError> : null}
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
            enLabel={t("admin.excerpt")}
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
          <AdminRichTextEditor
            label={`${t("admin.content")} (${t("admin.localeEn")})`}
            value={values.contentHtml ?? ""}
            onChange={(html) => void setFieldValue("contentHtml", html)}
            onBlur={() => setFieldTouched("contentHtml", true)}
            error={touched.contentHtml && errors.contentHtml ? localizeErrorMessage(String(errors.contentHtml), locale) : undefined}
            uploadToken={token}
          />
          <AdminRichTextEditor
            label={`${t("admin.content")} (${t("admin.localeFa")})`}
            value={values.contentHtmlFa ?? ""}
            onChange={(html) => void setFieldValue("contentHtmlFa", html)}
            onBlur={() => setFieldTouched("contentHtmlFa", true)}
            uploadToken={token}
          />
          <TextField value={values.tagsInput} variant="secondary" fullWidth onChange={(v) => void setFieldValue("tagsInput", String(v ?? ""))}>
            <Label className="text-sm font-semibold">{t("admin.tags")}</Label>
            <Input />
          </TextField>
          <AdminImageField label={t("admin.coverImage")} value={values.coverImageUrl} onChange={(p) => void setFieldValue("coverImageUrl", p)} token={token} />
          <div className="space-y-2">
            <p className="text-sm text-foreground/65">{t("admin.homeImageHint")}</p>
            <AdminImageField label={t("admin.homeImage")} value={values.homeImageUrl ?? null} onChange={(p) => void setFieldValue("homeImageUrl", p)} token={token} previewAspectRatio="4 / 5" />
          </div>
          <div className="space-y-4 rounded-xl border border-[var(--card-border)] bg-[var(--tag-bg)] p-4">
            <TextField
              value={values.liveUrl ?? ""}
              variant="secondary"
              fullWidth
              isInvalid={Boolean(touched.liveUrl && errors.liveUrl)}
              onBlur={() => setFieldTouched("liveUrl", true)}
              onChange={(value) => void setFieldValue("liveUrl", String(value ?? "").trim() || null)}
            >
              <Label className="text-sm font-semibold">{t("admin.projectLiveUrl")}</Label>
              <Input type="url" dir="ltr" placeholder="https://example.com" />
              {touched.liveUrl && errors.liveUrl ? <FieldError>{localizeErrorMessage(String(errors.liveUrl), locale)}</FieldError> : null}
            </TextField>
            <TextField
              value={values.repoUrl ?? ""}
              variant="secondary"
              fullWidth
              isInvalid={Boolean(touched.repoUrl && errors.repoUrl)}
              onBlur={() => setFieldTouched("repoUrl", true)}
              onChange={(value) => void setFieldValue("repoUrl", String(value ?? "").trim() || null)}
            >
              <Label className="text-sm font-semibold">{t("admin.projectRepoUrl")}</Label>
              <Input type="url" dir="ltr" placeholder="https://github.com/username/project" />
              {touched.repoUrl && errors.repoUrl ? <FieldError>{localizeErrorMessage(String(errors.repoUrl), locale)}</FieldError> : null}
            </TextField>
          </div>
          <div className="rounded-xl border border-[var(--card-border)] bg-[var(--tag-bg)] p-4 space-y-4">
            <AdminPublishedField
              checked={Boolean(values.published)}
              onChange={(selected) => void setFieldValue("published", selected)}
            />
            <AdminCheckboxField
              label={t("admin.featured")}
              checked={Boolean(values.featured)}
              onChange={(selected) => void setFieldValue("featured", selected)}
            />
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
