"use client";

import { Button, Checkbox, FieldError, Form, Input, Label, TextArea, TextField } from "@heroui/react";
import { Formik, FormikHelpers } from "formik";
import { useMemo } from "react";
import { submitContactForm } from "@/common/api/catalog";
import { useTranslation } from "@/common/i18n/useTranslation";
import type { ContactFormDto } from "@/common/interfaces";
import { applyApiErrorsToFormik, parseApiError } from "@/common/utils";
import { toast } from "@/common/utils/toast";
import { createContactSchema } from "@/common/validators";

const initial: ContactFormDto = { name: "", email: "", subject: "", message: "", allowPublicDisplay: false };

type Props = { dark?: boolean };

const fieldKeys = {
  name: "contact.name",
  email: "contact.email",
  subject: "contact.subject",
  message: "contact.message",
} as const;

export function ContactForm({ dark }: Props) {
  const { t, locale } = useTranslation();
  const validationSchema = useMemo(() => createContactSchema(locale), [locale]);

  async function onSubmit(values: ContactFormDto, helpers: FormikHelpers<ContactFormDto>) {
    try {
      await submitContactForm(values);
      toast.success(t("contact.success"));
      helpers.resetForm();
    } catch (err) {
      const parsed = parseApiError(err, locale);
      if (!applyApiErrorsToFormik(parsed, helpers)) toast.error(parsed.message);
    } finally {
      helpers.setSubmitting(false);
    }
  }

  return (
    <Formik initialValues={initial} validationSchema={validationSchema} onSubmit={onSubmit}>
      {({ values, errors, touched, handleSubmit, isSubmitting, setFieldValue, setFieldTouched }) => (
        <Form onSubmit={handleSubmit} className="contact-form space-y-4">
          {(["name", "email", "subject"] as const).map((field) => {
            const err = touched[field] ? errors[field] : undefined;
            return (
              <TextField
                key={field}
                value={values[field]}
                variant="secondary"
                fullWidth
                isInvalid={Boolean(err)}
                onBlur={() => setFieldTouched(field, true)}
                onChange={(v) => void setFieldValue(field, String(v ?? ""))}
              >
                <Label className={`text-sm font-semibold ${dark ? "text-background/80" : ""}`}>{t(fieldKeys[field])}</Label>
                <Input type={field === "email" ? "email" : "text"} />
                {err ? <FieldError>{err}</FieldError> : null}
              </TextField>
            );
          })}
          <TextField
            value={values.message}
            variant="secondary"
            fullWidth
            isInvalid={Boolean(touched.message && errors.message)}
            onBlur={() => setFieldTouched("message", true)}
            onChange={(v) => void setFieldValue("message", String(v ?? ""))}
          >
            <Label className={`text-sm font-semibold ${dark ? "text-background/80" : ""}`}>{t("contact.message")}</Label>
            <TextArea className="min-h-24" />
            {touched.message && errors.message ? <FieldError>{errors.message}</FieldError> : null}
          </TextField>
          <Checkbox
            isSelected={values.allowPublicDisplay}
            onChange={(selected) => void setFieldValue("allowPublicDisplay", selected)}
            className="items-start text-sm"
          >
            <Checkbox.Control>
              <Checkbox.Indicator />
            </Checkbox.Control>
            <Checkbox.Content>{t("contact.allowPublicDisplay")}</Checkbox.Content>
          </Checkbox>
          <Button
            type="submit"
            variant="primary"
            size="lg"
            isPending={isSubmitting}
            isDisabled={isSubmitting}
            className="w-full rounded-full font-bold uppercase tracking-wider"
          >
            {isSubmitting ? t("contact.sending") : t("contact.send")}
          </Button>
        </Form>
      )}
    </Formik>
  );
}
