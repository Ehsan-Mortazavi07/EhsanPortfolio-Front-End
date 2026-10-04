import { toast as heroToast } from "@heroui/react";
import type { ReactNode } from "react";
import { translate, type Locale } from "@/common/i18n";

type ToastOptions = {
  title?: ReactNode;
  description?: ReactNode;
  timeout?: number;
  onClose?: () => void;
};

function currentLocale(): Locale {
  return typeof document !== "undefined" && document.documentElement.lang === "fa" ? "fa" : "en";
}

function errorToast(message: ReactNode, options?: ToastOptions) {
  const { title, description, ...rest } = options ?? {};
  return heroToast.danger(title ?? translate(currentLocale(), "errors.title"), {
    ...rest,
    description: description ?? message,
  });
}

export const toast = {
  success: (message: ReactNode, options?: ToastOptions) => heroToast.success(message, options),
  info: (message: ReactNode, options?: ToastOptions) => heroToast.info(message, options),
  warning: (message: ReactNode, options?: ToastOptions) => heroToast.warning(message, options),
  error: errorToast,
  danger: errorToast,
  promise: heroToast.promise.bind(heroToast),
  close: heroToast.close.bind(heroToast),
};
