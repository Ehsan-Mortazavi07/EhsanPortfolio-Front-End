"use client";

import { Checkbox, cn } from "@heroui/react";

type Props = {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  className?: string;
  compact?: boolean;
};

export function AdminCheckboxField({ label, checked, onChange, className, compact }: Props) {
  return (
    <Checkbox
      className={cn(className)}
      isSelected={Boolean(checked)}
      aria-label={compact ? label : undefined}
      onChange={(selected) => onChange(selected)}
    >
      <Checkbox.Control>
        <Checkbox.Indicator />
      </Checkbox.Control>
      {compact ? null : <Checkbox.Content>{label}</Checkbox.Content>}
    </Checkbox>
  );
}
