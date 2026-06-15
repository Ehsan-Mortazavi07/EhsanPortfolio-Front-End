import { toast as heroToast } from "@heroui/react";
import type { ReactNode } from "react";

type ToastOptions = {
  description?: ReactNode;
  timeout?: number;
  onClose?: () => void;
};

export const toast = {
  success: (message: ReactNode, options?: ToastOptions) => heroToast.success(message, options),
  info: (message: ReactNode, options?: ToastOptions) => heroToast.info(message, options),
  warning: (message: ReactNode, options?: ToastOptions) => heroToast.warning(message, options),
  error: (message: ReactNode, options?: ToastOptions) => heroToast.danger(message, options),
  danger: (message: ReactNode, options?: ToastOptions) => heroToast.danger(message, options),
  promise: heroToast.promise.bind(heroToast),
  close: heroToast.close.bind(heroToast),
};
