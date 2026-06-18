"use client";

import { Button, Form, Input, Label, TextField } from "@heroui/react";
import { Formik, FormikHelpers } from "formik";
import { useEffect, useState } from "react";
import { adminGetSiteSettings, adminUpdateSiteSettings } from "@/common/api/admin";
import { SEED_SETTINGS } from "@/common/data/seed";
import type { SiteSettingsDto } from "@/common/interfaces";
import { useTranslation } from "@/common/i18n/useTranslation";
import { applyApiErrorsToFormik, parseApiError } from "@/common/utils";
import { toast } from "@/common/utils/toast";
import { siteSettingsSchema, toSiteSettingsPayload } from "@/common/validators";
import { AdminPageSubtitlesFields } from "@/components/admin/AdminPageSubtitlesFields";
import { AdminDualLocaleFields } from "@/components/admin/AdminDualLocaleFields";
import { AdminFileField } from "@/components/admin/AdminFileField";
import { AdminImageField } from "@/components/admin/AdminImageField";
import { AdminRichTextEditor } from "@/components/admin/AdminRichTextEditor";
import { tokenSelector } from "@/stores/auth/selectors";
import { useAppSelector } from "@/stores/hooks";

export default function AdminSettingsPage() {
  const { t } = useTranslation();
  const token = useAppSelector(tokenSelector);
  const [initial, setInitial] = useState<SiteSettingsDto>(SEED_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    void adminGetSiteSettings(token)
      .then((data) => setInitial(data as SiteSettingsDto))
      .catch(() => setInitial(SEED_SETTINGS))
      .finally(() => setLoading(false));
  }, [token]);

  async function onSubmit(values: SiteSettingsDto, helpers: FormikHelpers<SiteSettingsDto>) {
    if (!token) return;
    try {
      await adminUpdateSiteSettings(token, toSiteSettingsPayload(values));
      toast.success(t("admin.settingsSaved"));
    } catch (err) {
      const parsed = parseApiError(err);
      if (!applyApiErrorsToFormik(parsed, helpers)) toast.error(parsed.message);
    } finally {
      helpers.setSubmitting(false);
    }
  }

  if (loading) return <p className="text-sm text-foreground/60">{t("admin.loading")}</p>;

  return (
    <Formik initialValues={initial} validationSchema={siteSettingsSchema} enableReinitialize onSubmit={onSubmit}>
      {({ values, handleSubmit, isSubmitting, setFieldValue }) => (
        <Form onSubmit={handleSubmit} className="mx-auto max-w-2xl space-y-4">
          <h1 className="text-2xl font-bold">{t("admin.settings")}</h1>
          <AdminDualLocaleFields enName="heroTitle" faName="heroTitleFa" enLabel="Hero title" values={values} setFieldValue={setFieldValue} />
          <AdminDualLocaleFields enName="heroSubtitle" faName="heroSubtitleFa" enLabel="Hero subtitle" values={values} setFieldValue={setFieldValue} />
          <AdminDualLocaleFields enName="heroBio" faName="heroBioFa" enLabel={t("admin.heroBio")} values={values} setFieldValue={setFieldValue} multiline />
          {(["email", "location", "githubUrl", "linkedinUrl", "telegramUrl", "instagramUrl", "twitterUrl"] as const).map((f) => (
            <TextField key={f} value={String(values[f] ?? "")} variant="secondary" fullWidth onChange={(v) => void setFieldValue(f, String(v ?? "") || null)}>
              <Label className="text-sm font-semibold">{f}</Label>
              <Input />
            </TextField>
          ))}
          <AdminFileField
            label={t("admin.cv")}
            value={values.cvUrl}
            onChange={(p) => void setFieldValue("cvUrl", p)}
            token={token}
            accept=".pdf,application/pdf"
          />
          <AdminImageField label={t("admin.heroPortrait")} value={values.heroPortraitUrl} onChange={(p) => void setFieldValue("heroPortraitUrl", p)} token={token} />
          <AdminRichTextEditor label={`${t("admin.aboutContent")} (${t("admin.localeEn")})`} value={values.aboutContent ?? ""} onChange={(html) => void setFieldValue("aboutContent", html)} uploadToken={token} />
          <AdminRichTextEditor label={`${t("admin.aboutContent")} (${t("admin.localeFa")})`} value={values.aboutContentFa ?? ""} onChange={(html) => void setFieldValue("aboutContentFa", html)} uploadToken={token} />
          <AdminPageSubtitlesFields values={values} setFieldValue={setFieldValue} />
          <Button type="submit" variant="primary" isPending={isSubmitting} isDisabled={isSubmitting}>{t("admin.saveSettings")}</Button>
        </Form>
      )}
    </Formik>
  );
}
