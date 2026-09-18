export const canonicalToMaskedUz = (canon: string): string => {
  const digits = (canon || "").replace(/[^\d+]/g, "");
  const withPlus = digits.startsWith("+") ? digits : `+${digits}`;
  const just = withPlus.replace(/\D/g, "");
  const body = just.startsWith("998") ? just.slice(0) : `998${just}`;
  const nums = body.slice(0, 12);
  const code = nums.slice(3, 5);
  const p1 = nums.slice(5, 8);
  const p2 = nums.slice(8, 10);
  const p3 = nums.slice(10, 12);
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
  let rest = digits.startsWith("998") ? digits.slice(0) : `998${digits}`;
  rest = rest.slice(0, 12);
  return `+${rest}`;
};
