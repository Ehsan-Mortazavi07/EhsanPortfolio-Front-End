"use client";

import { Button, Form, Input, Label, TextField } from "@heroui/react";
import { Formik, FormikHelpers } from "formik";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { adminCreate, adminGet, adminUpdate } from "@/common/api/admin";
import { PATHS } from "@/common/constants";
import type { ArticleDetailDto } from "@/common/interfaces";
import { useTranslation } from "@/common/i18n/useTranslation";
import { applyApiErrorsToFormik, parseApiError } from "@/common/utils";
import { toast } from "@/common/utils/toast";
import { articleFormSchema, toArticlePayload } from "@/common/validators";
import { AdminDualLocaleFields } from "@/components/admin/AdminDualLocaleFields";
import { AdminPublishedField } from "@/components/admin/AdminPublishedField";
import { AdminImageField } from "@/components/admin/AdminImageField";
import { AdminRichTextEditor } from "@/components/admin/AdminRichTextEditor";
import { tokenSelector } from "@/stores/auth/selectors";
import { useAppSelector } from "@/stores/hooks";

type FormValues = {
  slug: string;
  title: string;
  titleFa: string;
  excerpt: string;
  excerptFa: string;
  contentHtml: string;
  contentHtmlFa: string;
  coverImageUrl: string | null;
  publishedAt: string;
  published: boolean;
};

const empty: FormValues = {
  slug: "",
  title: "",
  titleFa: "",
  excerpt: "",
  excerptFa: "",
  contentHtml: "",
  contentHtmlFa: "",
  coverImageUrl: null,
  publishedAt: new Date().toISOString().slice(0, 10),
  published: true,
};

export function AdminArticleForm({ mode, slug }: { mode: "create" | "edit"; slug?: string }) {
  const { t } = useTranslation();
  const token = useAppSelector(tokenSelector);
  const router = useRouter();
  const [initial, setInitial] = useState(empty);
  const [loading, setLoading] = useState(mode === "edit");

  useEffect(() => {
    if (mode !== "edit" || !slug || !token) return;
    void adminGet<ArticleDetailDto>(token, `/admin/articles/${slug}`)
      .then((data) =>
        setInitial({
          slug: data.slug,
          title: data.title,
          titleFa: data.titleFa ?? "",
          excerpt: data.excerpt,
          excerptFa: data.excerptFa ?? "",
          contentHtml: data.contentHtml,
          contentHtmlFa: data.contentHtmlFa ?? "",
          coverImageUrl: data.coverImageUrl,
          publishedAt: data.publishedAt.slice(0, 10),
          published: data.published ?? true,
        }),
      )
      .finally(() => setLoading(false));
  }, [mode, slug, token]);

  async function onSubmit(values: FormValues, helpers: FormikHelpers<FormValues>) {
    if (!token) return;
    try {
      const body = toArticlePayload(values);
      if (mode === "create") await adminCreate(token, "/admin/articles", body);
      else if (slug) await adminUpdate(token, `/admin/articles/${slug}`, body);
      toast.success(t("admin.saved"));
      router.push(PATHS.ADMIN_ARTICLES);
    } catch (err) {
      const parsed = parseApiError(err);
      if (!applyApiErrorsToFormik(parsed, helpers)) toast.error(parsed.message);
    } finally {
      helpers.setSubmitting(false);
    }
  }

  if (loading) return <p className="text-sm text-foreground/60">{t("admin.loading")}</p>;

  return (
    <Formik initialValues={initial} validationSchema={articleFormSchema} enableReinitialize onSubmit={onSubmit}>
      {({ values, handleSubmit, isSubmitting, setFieldValue }) => (
        <Form onSubmit={handleSubmit} className="mx-auto max-w-3xl space-y-4">
          <h1 className="text-2xl font-bold">{mode === "create" ? t("admin.newArticle") : t("admin.editArticle")}</h1>
          <TextField value={values.slug} variant="secondary" fullWidth onChange={(v) => void setFieldValue("slug", String(v ?? ""))}>
            <Label className="text-sm font-semibold">{t("common.slug")}</Label>
            <Input />
          </TextField>
          <AdminDualLocaleFields enName="title" faName="titleFa" enLabel={t("common.name")} values={values} setFieldValue={setFieldValue} />
          <AdminDualLocaleFields enName="excerpt" faName="excerptFa" enLabel="Excerpt" values={values} setFieldValue={setFieldValue} multiline />
          <TextField value={values.publishedAt} variant="secondary" fullWidth onChange={(v) => void setFieldValue("publishedAt", String(v ?? ""))}>
            <Label className="text-sm font-semibold">Published at</Label>
            <Input type="date" />
          </TextField>
          <AdminImageField label={t("admin.cover")} value={values.coverImageUrl} onChange={(p) => void setFieldValue("coverImageUrl", p)} token={token} />
          <AdminPublishedField
            checked={Boolean(values.published)}
            onChange={(v) => void setFieldValue("published", v)}
          />
          <AdminRichTextEditor label={`${t("admin.content")} (${t("admin.localeEn")})`} value={values.contentHtml} onChange={(html) => void setFieldValue("contentHtml", html)} uploadToken={token} />
          <AdminRichTextEditor label={`${t("admin.content")} (${t("admin.localeFa")})`} value={values.contentHtmlFa} onChange={(html) => void setFieldValue("contentHtmlFa", html)} uploadToken={token} />
          <Button type="submit" variant="primary" isPending={isSubmitting} isDisabled={isSubmitting}>{t("admin.save")}</Button>
        </Form>
      )}
    </Formik>
  );
}
