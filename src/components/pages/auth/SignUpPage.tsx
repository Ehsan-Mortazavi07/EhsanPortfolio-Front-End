"use client";

import {
  Button,
  Card,
  FieldError,
  Form,
  Input,
  Label,
  TextField,
} from "@heroui/react";
import { Formik, FormikHelpers } from "formik";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { registerAccount } from "@/common/api/auth";
import { PATHS } from "@/common/constants";
import type { IRegisterForm } from "@/common/interfaces";
import { useTranslation } from "@/common/i18n/useTranslation";
import { parseApiError } from "@/common/utils";
import { toast } from "@/common/utils/toast";
import { registerSchema } from "@/common/validators";
import { Logo } from "@/components/common/brand/Logo";
import { LocaleSwitcher } from "@/components/common/preferences/LocaleSwitcher";
import { ThemeSwitcher } from "@/components/common/preferences/ThemeSwitcher";
import { PublicShell } from "@/components/common/shell";

const initial: IRegisterForm = { name: "", email: "", password: "" };

export function SignUpPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [done, setDone] = useState(false);

  async function onSubmit(values: IRegisterForm, helpers: FormikHelpers<IRegisterForm>) {
    try {
      await registerAccount(values);
      setDone(true);
      toast.success(t("auth.signUpSuccess"));
    } catch (err) {
      toast.error(parseApiError(err).message || "Registration failed.");
    } finally {
      helpers.setSubmitting(false);
    }
  }

  return (
    <PublicShell>
      <div className="auth-page hero-atmosphere hero-pillars flex min-h-dvh flex-col px-4 py-8">
        <div className="auth-page-topbar section-container relative z-10 flex items-center justify-between py-4">
          <Logo hero />
          <div className="flex items-center gap-1">
            <ThemeSwitcher hero />
            <LocaleSwitcher hero />
          </div>
        </div>
        <div className="relative z-10 flex flex-1 items-center justify-center">
          <Card className="auth-card">
            <Card.Header className="flex-col items-start gap-2 pb-6">
              <Card.Title className="auth-card-title">{t("auth.signUpTitle")}</Card.Title>
              <Card.Description className="auth-card-desc">{t("auth.signUpSubtitle")}</Card.Description>
            </Card.Header>
            <Card.Content>
              {done ? (
                <div className="space-y-5">
                  <p className="auth-card-body-text">{t("auth.signUpSuccess")}</p>
                  <Button
                    variant="primary"
                    fullWidth
                    className="button--hero-cta font-bold uppercase tracking-wider"
                    onPress={() => router.push(PATHS.SIGN_IN)}
                  >
                    {t("auth.signIn")}
                  </Button>
                </div>
              ) : (
                <Formik initialValues={initial} validationSchema={registerSchema} onSubmit={onSubmit}>
                  {({ values, errors, touched, handleSubmit, isSubmitting, setFieldValue, setFieldTouched }) => (
                    <Form onSubmit={handleSubmit} className="flex flex-col gap-5">
                      <TextField
                        value={values.name}
                        variant="secondary"
                        fullWidth
                        isInvalid={Boolean(touched.name && errors.name)}
                        onBlur={() => setFieldTouched("name", true)}
                        onChange={(v) => void setFieldValue("name", String(v ?? ""))}
                      >
                        <Label className="auth-card-label">{t("auth.name")}</Label>
                        <Input autoComplete="name" />
                        {touched.name && errors.name ? <FieldError>{errors.name}</FieldError> : null}
                      </TextField>
                      <TextField
                        value={values.email}
                        variant="secondary"
                        fullWidth
                        isInvalid={Boolean(touched.email && errors.email)}
                        onBlur={() => setFieldTouched("email", true)}
                        onChange={(v) => void setFieldValue("email", String(v ?? ""))}
                      >
                        <Label className="auth-card-label">{t("auth.email")}</Label>
                        <Input type="email" autoComplete="email" />
                        {touched.email && errors.email ? <FieldError>{errors.email}</FieldError> : null}
                      </TextField>
                      <TextField
                        value={values.password}
                        variant="secondary"
                        fullWidth
                        isInvalid={Boolean(touched.password && errors.password)}
                        onBlur={() => setFieldTouched("password", true)}
                        onChange={(v) => void setFieldValue("password", String(v ?? ""))}
                      >
                        <Label className="auth-card-label">{t("auth.password")}</Label>
                        <Input type="password" autoComplete="new-password" />
                        {touched.password && errors.password ? <FieldError>{errors.password}</FieldError> : null}
                      </TextField>
                      <Button
                        type="submit"
                        variant="primary"
                        fullWidth
                        isPending={isSubmitting}
                        isDisabled={isSubmitting}
                        className="button--hero-cta font-bold uppercase tracking-wider"
                      >
                        {t("auth.createAccount")}
                      </Button>
                    </Form>
                  )}
                </Formik>
              )}
              <p className="auth-card-link mt-6 text-sm">
                {t("auth.haveAccount")}{" "}
                <Link href={PATHS.SIGN_IN} className="auth-card-link-strong hover:underline">
                  {t("auth.signIn")}
                </Link>
              </p>
              <Link href={PATHS.HOME} className="auth-card-link mt-4 inline-block">
                ← {t("nav.home")}
              </Link>
            </Card.Content>
          </Card>
        </div>
      </div>
    </PublicShell>
  );
}
