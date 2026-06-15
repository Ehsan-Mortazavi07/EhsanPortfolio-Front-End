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
import { useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Logo } from "@/components/common/brand/Logo";
import { LocaleSwitcher } from "@/components/common/preferences/LocaleSwitcher";
import { ThemeSwitcher } from "@/components/common/preferences/ThemeSwitcher";
import { PublicShell } from "@/components/common/shell";
import { PATHS } from "@/common/constants";
import { useTranslation } from "@/common/i18n/useTranslation";
import type { ILoginForm } from "@/common/interfaces";
import { isAdminUser } from "@/common/utils/auth-user";
import { toast } from "@/common/utils/toast";
import { loginSchema } from "@/common/validators";
import { loginAction } from "@/stores/auth/actions";
import { isAuthSelector, userSelector } from "@/stores/auth/selectors";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";

const initial: ILoginForm = { email: "", password: "" };

export function SignInPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useTranslation();
  const isAuth = useAppSelector(isAuthSelector);
  const user = useAppSelector(userSelector);
  const next = searchParams.get("next") || PATHS.ADMIN;

  useEffect(() => {
    if (isAuth && isAdminUser(user)) {
      router.replace(next);
    }
  }, [isAuth, next, router, user]);

  async function onSubmit(values: ILoginForm, helpers: FormikHelpers<ILoginForm>) {
    try {
      await dispatch(loginAction(values));
      toast.success(t("auth.signIn"));
      router.replace(next);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Login failed.");
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
              <Card.Title className="auth-card-title">{t("auth.signIn")}</Card.Title>
              <Card.Description className="auth-card-desc">{t("admin.panel")}</Card.Description>
            </Card.Header>
            <Card.Content>
              <Formik initialValues={initial} validationSchema={loginSchema} onSubmit={onSubmit}>
                {({ values, errors, touched, handleSubmit, isSubmitting, setFieldValue, setFieldTouched }) => (
                  <Form onSubmit={handleSubmit} className="flex flex-col gap-5">
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
                      <Input type="password" autoComplete="current-password" />
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
                      {t("auth.submit")}
                    </Button>
                  </Form>
                )}
              </Formik>
              <Link href={PATHS.HOME} className="auth-card-link mt-6 inline-block">
                ← {t("nav.home")}
              </Link>
              <p className="auth-card-link mt-4 text-sm">
                {t("auth.needAccount")}{" "}
                <Link href={PATHS.SIGN_UP} className="auth-card-link-strong hover:underline">
                  {t("auth.signUp")}
                </Link>
              </p>
            </Card.Content>
          </Card>
        </div>
      </div>
    </PublicShell>
  );
}
