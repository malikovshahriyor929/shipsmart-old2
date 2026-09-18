import * as React from "react";
import { Controller, type Control } from "react-hook-form";
import { Input } from "rizzui";

/** Keep the canonical form as +998XXXXXXXXX (plus + 12 digits total, incl. 998 + 9 local) */
export const canonicalToMaskedUz = (canon: string): string => {
  // strip to + and digits
  const digits = (canon || "").replace(/[^\d+]/g, "");
  const withPlus = digits.startsWith("+") ? digits : `+${digits}`;
  const just = withPlus.replace(/\D/g, "");

  // ensure leading 998
  const body = just.startsWith("998") ? just.slice(0) : `998${just}`;
  const nums = body.slice(0, 12); // 998 + 9 = 12 digits

  const code = nums.slice(3, 5); // (XX)
  const p1 = nums.slice(5, 8); // XXX
  const p2 = nums.slice(8, 10); // XX
  const p3 = nums.slice(10, 12); // XX

  let out = "+998";
  if (code) out += `(${code}`;
  if (code && code.length === 2) out += ")";
  if (p1) out += ` ${p1}`;
  if (p2) out += ` ${p2}`;
  if (p3) out += ` ${p3}`;
  return out;
};

export const maskedToCanonicalUz = (masked: string): string => {
  const digits = (masked || "").replace(/\D/g, "");
  // always enforce +998 prefix
  let rest = digits.startsWith("998") ? digits.slice(0) : `998${digits}`;
  rest = rest.slice(0, 12); // 998 + 9 digits
  return `+${rest}`;
};

// Used while typing in the field
const normalizeToCanonical = (input: string): string => {
  const digits = input.replace(/\D/g, "");
  const withPrefix = digits.startsWith("998") ? digits : `998${digits}`;
  const twelve = withPrefix.slice(0, 12);
  return `+${twelve}`;
};

type RHUzPhoneFieldProps<T extends Record<string, any>> = {
  control: Control<T>;
  name: keyof T & string;
  label?: React.ReactNode;
  error?: string;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  placeholder?: string;
};

export function RHUzPhoneField<T extends Record<string, any>>({
  control,
  name,
  label,
  error,
  disabled,
  leftIcon,
  placeholder = "e.g. +998(90) 123 45 67",
}: RHUzPhoneFieldProps<T>) {
  return (
    <Controller
      control={control}
      name={name as any}
      render={({ field }) => {
        const masked = canonicalToMaskedUz(field.value ?? "+998");
        return (
          <Input
            label={label}
            placeholder={placeholder}
            prefix={leftIcon}
            value={masked}
            disabled={disabled}
            error={error}
            onChange={(e) => {
              const canonical = normalizeToCanonical(e.target.value);
              field.onChange(canonical);
            }}
            onBlur={field.onBlur}
          />
        );
      }}
    />
  );
}
