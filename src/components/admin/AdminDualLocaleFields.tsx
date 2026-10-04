"use client";

import { FieldError, Input, Label, TextArea, TextField } from "@heroui/react";
import { useTranslation } from "@/common/i18n/useTranslation";
import { localizeErrorMessage } from "@/common/utils/api-error";

function getByPath(source: object, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object") return (acc as Record<string, unknown>)[key];
    return undefined;
  }, source);
}

type Props<T extends object> = {
  enName: string;
  faName: string;
  enLabel: string;
  values: T;
  errors?: Partial<Record<string, unknown>>;
  touched?: Partial<Record<string, unknown>>;
  setFieldValue: (field: string, value: string) => void;
  setFieldTouched?: (field: string, touched: boolean) => void;
  multiline?: boolean;
  required?: boolean;
};

export function AdminDualLocaleFields<T extends object>({
  enName,
  faName,
  enLabel,
  values,
  errors,
  touched,
  setFieldValue,
  setFieldTouched,
  multiline,
  required,
}: Props<T>) {
  const { t, locale } = useTranslation();
  const faLabel = `${enLabel} (${t("admin.localeFa")})`;

  function readValue(name: string) {
    return String(getByPath(values, name) ?? "");
  }

  function renderField(name: string, label: string) {
    const fieldError = getByPath(errors ?? {}, name);
    const invalid = Boolean(getByPath(touched ?? {}, name) && fieldError);
    return (
      <TextField
        key={name}
        value={readValue(name)}
        variant="secondary"
        fullWidth
        isRequired={required}
        isInvalid={invalid}
        onBlur={() => setFieldTouched?.(name, true)}
        onChange={(v) => void setFieldValue(name, String(v ?? ""))}
      >
        <Label className="text-sm font-semibold">{label}</Label>
        {multiline ? <TextArea className="min-h-24" /> : <Input />}
        {invalid ? <FieldError>{localizeErrorMessage(String(fieldError), locale)}</FieldError> : null}
      </TextField>
    );
  }

  return (
    <div className="space-y-4 rounded-xl bg-surface/50 p-4 ring-1 ring-border/40">
      <p className="text-xs font-semibold uppercase tracking-wide text-foreground/50">{enLabel}</p>
      {renderField(enName, `${enLabel} (${t("admin.localeEn")})`)}
      {renderField(faName, faLabel)}
    </div>
  );
}
