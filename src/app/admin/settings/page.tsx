"use client";

import { Button, FieldError, Form, Input, Label, TextField } from "@heroui/react";
import { Formik, FormikHelpers } from "formik";
import { useEffect, useState } from "react";
import { adminGetSiteSettings, adminUpdateSiteSettings } from "@/common/api/admin";
import { SEED_SETTINGS } from "@/common/data/seed";
import type { SiteSettingsDto } from "@/common/interfaces";
import { useTranslation } from "@/common/i18n/useTranslation";
import { applyApiErrorsToFormik, localizeErrorMessage, parseApiError } from "@/common/utils";
import { toast } from "@/common/utils/toast";
import { siteSettingsSchema, toSiteSettingsPayload } from "@/common/validators";
import { AdminPageSubtitlesFields } from "@/components/admin/AdminPageSubtitlesFields";
import { AdminDualLocaleFields } from "@/components/admin/AdminDualLocaleFields";
import { AdminFileField } from "@/components/admin/AdminFileField";
import { AdminImageField } from "@/components/admin/AdminImageField";
import { AdminRichTextEditor } from "@/components/admin/AdminRichTextEditor";
import { tokenSelector } from "@/stores/auth/selectors";
import { useAppSelector } from "@/stores/hooks";

const settingsFieldLabelKeys = {
  email: "admin.settingsEmail",
  location: "admin.settingsLocation",
  githubUrl: "admin.settingsGithub",
  linkedinUrl: "admin.settingsLinkedin",
  telegramUrl: "admin.settingsTelegram",
  instagramUrl: "admin.settingsInstagram",
  twitterUrl: "admin.settingsTwitter",
} as const;

export default function AdminSettingsPage() {
  const { t, locale } = useTranslation();
  const token = useAppSelector(tokenSelector);
  const [initial, setInitial] = useState<SiteSettingsDto>(SEED_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    void adminGetSiteSettings(token)
      .then((data) => setInitial(data as SiteSettingsDto))
      .catch((err) => {
        toast.error(parseApiError(err, locale).message);
        setInitial(SEED_SETTINGS);
      })
      .finally(() => setLoading(false));
  }, [token, locale]);

  async function onSubmit(values: SiteSettingsDto, helpers: FormikHelpers<SiteSettingsDto>) {
    if (!token) return;
    try {
      await adminUpdateSiteSettings(token, toSiteSettingsPayload(values));
      toast.success(t("admin.settingsSaved"));
    } catch (err) {
      const parsed = parseApiError(err, locale);
      if (!applyApiErrorsToFormik(parsed, helpers)) toast.error(parsed.message);
    } finally {
      helpers.setSubmitting(false);
    }
  }

  if (loading) return <p className="text-sm text-foreground/60">{t("admin.loading")}</p>;

  return (
    <Formik initialValues={initial} validationSchema={siteSettingsSchema} enableReinitialize onSubmit={onSubmit}>
      {({ values, errors, touched, handleSubmit, isSubmitting, setFieldValue, setFieldTouched }) => (
        <Form onSubmit={handleSubmit} className="mx-auto max-w-2xl space-y-4">
          <h1 className="text-2xl font-bold">{t("admin.settings")}</h1>
          <AdminDualLocaleFields enName="heroTitle" faName="heroTitleFa" enLabel={t("admin.heroTitle")} values={values} errors={errors} touched={touched} setFieldValue={setFieldValue} setFieldTouched={setFieldTouched} required />
          <AdminDualLocaleFields enName="heroSubtitle" faName="heroSubtitleFa" enLabel={t("admin.heroSubtitle")} values={values} errors={errors} touched={touched} setFieldValue={setFieldValue} setFieldTouched={setFieldTouched} required />
          <AdminDualLocaleFields enName="heroBio" faName="heroBioFa" enLabel={t("admin.heroBio")} values={values} errors={errors} touched={touched} setFieldValue={setFieldValue} setFieldTouched={setFieldTouched} multiline required />
          {(["email", "location", "githubUrl", "linkedinUrl", "telegramUrl", "instagramUrl", "twitterUrl"] as const).map((f) => (
            <TextField key={f} value={String(values[f] ?? "")} variant="secondary" fullWidth isInvalid={Boolean(touched[f] && errors[f])} onBlur={() => setFieldTouched(f, true)} onChange={(v) => void setFieldValue(f, String(v ?? "") || null)}>
              <Label className="text-sm font-semibold">{t(settingsFieldLabelKeys[f])}</Label>
              <Input />
              {touched[f] && errors[f] ? <FieldError>{localizeErrorMessage(String(errors[f]), locale)}</FieldError> : null}
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
          <AdminPageSubtitlesFields values={values} errors={errors} touched={touched} setFieldValue={setFieldValue} setFieldTouched={setFieldTouched} />
          <Button type="submit" variant="primary" isPending={isSubmitting} isDisabled={isSubmitting}>{t("admin.saveSettings")}</Button>
        </Form>
      )}
    </Formik>
  );
}
