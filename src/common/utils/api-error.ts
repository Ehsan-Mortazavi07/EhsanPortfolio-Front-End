import axios from "axios";
import type { FormikHelpers } from "formik";
import { translate, type Locale, type MessageKey } from "@/common/i18n";

export type ApiFieldError = { field?: string; message: string };
export type ParsedApiError = { message: string; errors: ApiFieldError[] };

const messageKeys: Record<string, MessageKey> = {
  "login failed": "admin.loginFailed",
  "sign in failed": "admin.loginFailed",
  "invalid email or password": "errors.invalidCredentials",
  "email or password is incorrect": "errors.invalidCredentials",
  "ایمیل یا رمز عبور اشتباه است": "errors.invalidCredentials",
  "دسترسی غیرمجاز است": "errors.unauthorized",
  "شما مجوز انجام این عملیات را ندارید": "errors.forbidden",
  "مورد درخواستی یافت نشد": "errors.notFound",
  "پیام‌دهنده اجازه نمایش عمومی پیام را نداده است": "errors.publicDisplayConsentRequired",
  "درخواست نامعتبر است": "errors.badRequest",
  "اعتبارسنجی داده‌ها با خطا مواجه شد": "errors.validation",
  "خطای داخلی سرور": "errors.server",
  "حساب شما در انتظار تأیید ادمین است": "errors.accountPending",
  "درخواست دسترسی شما تأیید نشده است": "errors.accountRejected",
  "این ایمیل قبلاً ثبت شده است": "errors.emailExists",
  "این شناسه یکتا قبلاً استفاده شده است": "errors.slugExists",
  "این شناسه یکتا قبلاً استفاده شده": "errors.slugExists",
  "فایل الزامی است": "errors.fileRequired",
  "please check the form fields": "errors.checkFields",
  "request failed": "errors.requestFailed",
  "network error": "errors.network",
  "failed to load": "errors.requestFailed",
  "failed to load list": "errors.requestFailed",
  "not authenticated": "errors.unauthorized",
  "حجم فایل بیش از حد مجاز است": "errors.uploadTooLarge",
  "آپلود فایل با خطا مواجه شد": "errors.uploadFailed",
  "email is required": "errors.emailRequired",
  "please enter your email address": "errors.emailRequired",
  "invalid email": "errors.emailInvalid",
  "email must be an email": "errors.emailInvalid",
  "enter a valid email address": "errors.emailInvalid",
  "name is required": "errors.nameRequired",
  "please enter your name": "errors.nameRequired",
  "name must be a string": "errors.nameRequired",
  "نام الزامی است": "errors.nameRequired",
  "نام باید متن باشد": "errors.nameRequired",
  "password is required": "errors.passwordRequired",
  "رمز عبور الزامی است": "errors.passwordRequired",
  "رمز عبور باید حداقل ۶ کاراکتر باشد": "errors.passwordMin",
  "enter a password": "errors.passwordRequired",
  "min 6 characters": "errors.passwordMin",
  "password must be at least 6 characters": "errors.passwordMin",
  "slug is required": "errors.slugRequired",
  "شناسه یکتا الزامی است": "errors.slugRequired",
  "شناسه اسلاگ الزامی است": "errors.slugRequired",
  "شناسه یکتا باید متن باشد": "errors.slugFormat",
  "عنوان الزامی است": "errors.titleRequired",
  "عنوان باید متن باشد": "errors.titleRequired",
  "رمز عبور باید متن باشد": "errors.passwordRequired",
  "نام شرکت الزامی است": "errors.companyRequired",
  "سمت الزامی است": "errors.roleRequired",
  "نام مهارت الزامی است": "errors.nameRequired",
  "ایمیل معتبر نیست": "errors.emailInvalid",
  "نقش کاربر نامعتبر است": "errors.roleInvalid",
  "وضعیت کاربر نامعتبر است": "errors.statusInvalid",
  "عبارت جستجو باید متن باشد": "errors.searchTextRequired",
  "شماره صفحه باید عدد صحیح باشد": "errors.pageInteger",
  "شماره صفحه باید حداقل ۱ باشد": "errors.pageMinimum",
  "اندازه صفحه باید عدد صحیح باشد": "errors.pageSizeInteger",
  "اندازه صفحه باید حداقل ۱ باشد": "errors.pageSizeMinimum",
  "اندازه صفحه نمی‌تواند بیشتر از ۱۰۰ باشد": "errors.pageSizeMaximum",
  "use lowercase letters, numbers, and hyphens": "errors.slugFormat",
  "title is required": "errors.titleRequired",
  "excerpt is required": "errors.excerptRequired",
  "content is required": "errors.contentRequired",
  "description is required": "errors.contentRequired",
  "متن نظر الزامی است": "errors.contentRequired",
  "پیام الزامی است": "errors.contentRequired",
  "role is required": "errors.roleRequired",
  "company is required": "errors.companyRequired",
  "period is required": "errors.periodRequired",
  "invalid url": "errors.urlInvalid",
  "enter a valid url": "errors.urlInvalid",
  "enter a valid image url or upload a file": "errors.imageInvalid",
  "دسته‌بندی مهارت نامعتبر است": "errors.categoryInvalid",
  "category is required": "errors.categoryRequired",
  "published date is required": "errors.publishedAtRequired",
  "hero title is required": "errors.titleRequired",
  "hero subtitle is required": "errors.titleRequired",
  "hero bio is required": "errors.contentRequired",
};

function normalizeMessage(message: unknown): string {
  if (typeof message === "string" && message.trim()) return message.trim();
  if (Array.isArray(message)) return message.map(String).filter(Boolean).join(" — ");
  return "";
}

function normalizeForLookup(message: string): string {
  return message
    .trim()
    .replace(/[.!?؟]+$/u, "")
    .replace(/[يى]/g, "ی")
    .replace(/ك/g, "ک")
    .toLocaleLowerCase("en-US");
}

export function localizeErrorMessage(message: string, locale: Locale): string {
  const key = errorMessageKey(message);
  return key ? translate(locale, key) : message;
}

function translateKnownMessage(message: string, locale: Locale): string | undefined {
  const key = errorMessageKey(message);
  return key ? translate(locale, key) : undefined;
}

function errorMessageKey(message: string): MessageKey | undefined {
  const normalized = normalizeForLookup(message);
  const mapped = messageKeys[normalized];
  if (mapped) return mapped;
  if (/^[\w.]+ must be a string$/i.test(normalized)) return "errors.textRequired";
  if (/^[\w.]+ must not be empty$/i.test(normalized)) return "errors.textRequired";
  return undefined;
}

function statusMessage(status: number | undefined, locale: Locale): string {
  if (status === 400 || status === 422) return translate(locale, "errors.validation");
  if (status === 401) return translate(locale, "errors.unauthorized");
  if (status === 403) return translate(locale, "errors.forbidden");
  if (status === 404) return translate(locale, "errors.notFound");
  if (status === 409) return translate(locale, "errors.badRequest");
  if (status === 413) return translate(locale, "errors.uploadTooLarge");
  if (status !== undefined && status >= 500) return translate(locale, "errors.server");
  return translate(locale, "errors.requestFailed");
}

export function parseApiError(err: unknown, locale: Locale = "en"): ParsedApiError {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data;
    if (data && typeof data === "object") {
      const body = data as { message?: unknown; errors?: unknown; statusCode?: unknown };
      const status = err.response?.status ?? (typeof body.statusCode === "number" ? body.statusCode : undefined);
      const rawMessages = Array.isArray(body.message)
        ? body.message.map(normalizeMessage).filter(Boolean)
        : [normalizeMessage(body.message)].filter(Boolean);
      const localizedMessages = rawMessages
        .map((raw) => translateKnownMessage(raw, locale))
        .filter((message): message is string => message !== undefined);
      const message = localizedMessages.length
        ? localizedMessages.join(" · ")
        : statusMessage(status, locale);
      const errors: ApiFieldError[] = [];
      for (const raw of rawMessages) {
        const localized = translateKnownMessage(raw, locale);
        if (localized) errors.push({ message: localized });
      }
      if (Array.isArray(body.errors)) {
        for (const item of body.errors) {
          if (!item || typeof item !== "object") continue;
          const row = item as Record<string, unknown>;
          const raw = typeof row.message === "string" ? row.message.trim() : "";
          if (!raw) continue;
          const field = typeof row.field === "string" && row.field.trim() ? row.field.trim() : undefined;
          errors.push({ field, message: localizeErrorMessage(raw, locale) });
        }
      }
      return { message, errors };
    }
    return {
      message: err.response ? statusMessage(err.response.status, locale) : translate(locale, "errors.network"),
      errors: [],
    };
  }

  if (err instanceof Error && err.message.trim()) {
    const translated = translateKnownMessage(err.message, locale);
    return {
      message: translated ?? translate(locale, "errors.requestFailed"),
      errors: [],
    };
  }
  return { message: translate(locale, "errors.requestFailed"), errors: [] };
}

export function applyApiErrorsToFormik<T extends object>(
  parsed: ParsedApiError,
  helpers: Pick<FormikHelpers<T>, "setFieldError" | "setFieldTouched">,
): boolean {
  let applied = false;
  for (const item of parsed.errors) {
    if (!item.field) continue;
    helpers.setFieldError(item.field as never, item.message);
    void helpers.setFieldTouched(item.field as never, true, false);
    applied = true;
  }
  return applied;
}
