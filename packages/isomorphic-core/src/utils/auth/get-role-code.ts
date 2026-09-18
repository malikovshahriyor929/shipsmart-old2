export default function getRoleCode(role: any): number | null {
  if (!role) return null;

  if (typeof role === "number") return role;
  if (typeof role?.value === "number") return role.value;
  if (typeof role?.id === "number") return role.id;

  const str =
    (typeof role?.value === "string" && role.value) ||
    (typeof role?.id === "string" && role.id) ||
    (typeof role === "string" && role);

  if (str && /^\d+$/.test(str)) return Number(str);

  if (role.text || role.label) {
    const label = (role?.text || role?.label || "").toString().toLowerCase();
    switch (label) {
      case "super_admin":
        return 1;
      case "admin":
        return 2;
      case "advisor":
        return 3;
      case "teacher":
        return 4;
      case "student":
        return 5;
      case "head_counselor":
        return 6;
      default:
        break;
    }
  }

  return null;
}
