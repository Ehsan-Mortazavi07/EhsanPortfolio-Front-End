"use client";

import { Button, FieldError, Form, Input, Label, Modal, TextArea, TextField, useOverlayState } from "@heroui/react";
import { Formik, type FormikHelpers } from "formik";
import { useState } from "react";
import { adminCreate } from "@/common/api/admin";
import type { ContactFormDto } from "@/common/interfaces";
import { createContactSchema } from "@/common/validators";
import { useTranslation } from "@/common/i18n/useTranslation";
import { applyApiErrorsToFormik, parseApiError } from "@/common/utils/api-error";
import { toast } from "@/common/utils/toast";
import { tokenSelector } from "@/stores/auth/selectors";
import { useAppSelector } from "@/stores/hooks";

const emptyMessage: ContactFormDto = { name: "", email: "", subject: "", message: "" };

type Props = { onCreated: () => Promise<void> };

export function AdminContactMessageCreateModal({ onCreated }: Props) {
  const { t, locale } = useTranslation();
  const token = useAppSelector(tokenSelector);
  const [isOpen, setIsOpen] = useState(false);
  const modalState = useOverlayState({ isOpen, onOpenChange: setIsOpen });

  async function createMessage(values: ContactFormDto, helpers: FormikHelpers<ContactFormDto>) {
    if (!token) {
      helpers.setSubmitting(false);
      return;
    }

    try {
      await adminCreate(token, "/admin/contact-messages", values);
      toast.success(t("admin.messageCreated"));
      setIsOpen(false);
      helpers.resetForm();
      await onCreated();
    } catch (error) {
      const parsed = parseApiError(error, locale);
      if (!applyApiErrorsToFormik(parsed, helpers)) toast.error(parsed.message);
    } finally {
      helpers.setSubmitting(false);
    }
  }

  return (
    <>
      <Button variant="primary" onPress={modalState.open}>{t("admin.addNew")}</Button>
      <Modal state={modalState}>
        <Modal.Backdrop className="bg-black/65 backdrop-blur-sm">
          <Modal.Container size="lg" placement="center" scroll="inside">
            <Modal.Dialog className="admin-message-dialog">
              <Formik
                initialValues={emptyMessage}
                validationSchema={createContactSchema(locale)}
                onSubmit={createMessage}
              >
                {({ values, errors, touched, handleSubmit, isSubmitting, setFieldValue, setFieldTouched }) => (
                  <Form onSubmit={handleSubmit} className="flex max-h-[85dvh] flex-col">
                    <Modal.Header>
                      <Modal.Heading>{t("admin.newMessage")}</Modal.Heading>
                    </Modal.Header>
                    <Modal.Body className="space-y-4">
                      <TextField
                        value={values.name}
                        variant="secondary"
                        fullWidth
                        isInvalid={Boolean(touched.name && errors.name)}
                        onBlur={() => setFieldTouched("name", true)}
                        onChange={(value) => void setFieldValue("name", String(value ?? ""))}
                      >
                        <Label className="text-sm font-semibold">{t("contact.name")}</Label>
                        <Input />
                        {touched.name && errors.name ? <FieldError>{errors.name}</FieldError> : null}
                      </TextField>
                      <TextField
                        value={values.email}
                        variant="secondary"
                        fullWidth
                        isInvalid={Boolean(touched.email && errors.email)}
                        onBlur={() => setFieldTouched("email", true)}
                        onChange={(value) => void setFieldValue("email", String(value ?? ""))}
                      >
                        <Label className="text-sm font-semibold">{t("contact.email")}</Label>
                        <Input type="email" />
                        {touched.email && errors.email ? <FieldError>{errors.email}</FieldError> : null}
                      </TextField>
                      <TextField
                        value={values.subject}
                        variant="secondary"
                        fullWidth
                        isInvalid={Boolean(touched.subject && errors.subject)}
                        onBlur={() => setFieldTouched("subject", true)}
                        onChange={(value) => void setFieldValue("subject", String(value ?? ""))}
                      >
                        <Label className="text-sm font-semibold">{t("contact.subject")}</Label>
                        <Input />
                        {touched.subject && errors.subject ? <FieldError>{errors.subject}</FieldError> : null}
                      </TextField>
                      <TextField
                        value={values.message}
                        variant="secondary"
                        fullWidth
                        isInvalid={Boolean(touched.message && errors.message)}
                        onBlur={() => setFieldTouched("message", true)}
                        onChange={(value) => void setFieldValue("message", String(value ?? ""))}
                      >
                        <Label className="text-sm font-semibold">{t("contact.message")}</Label>
                        <TextArea className="min-h-28" />
                        {touched.message && errors.message ? <FieldError>{errors.message}</FieldError> : null}
                      </TextField>
                    </Modal.Body>
                    <Modal.Footer>
                      <Button variant="secondary" onPress={modalState.close}>{t("admin.cancel")}</Button>
                      <Button type="submit" variant="primary" isPending={isSubmitting} isDisabled={isSubmitting}>
                        {t("admin.save")}
                      </Button>
                    </Modal.Footer>
                  </Form>
                )}
              </Formik>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
    </>
  );
}
