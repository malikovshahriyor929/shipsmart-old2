import { PLACEHOLDER_AVATAR } from "@core/config/constants";
import { ProfileUser } from "@core/types";
import { fullName } from "./course-utils";

export function getProfileUser(
  rawUser: any
): ProfileUser & { student_no?: string } {
  const first = rawUser?.first_name || rawUser?.given_name || "";
  const last = rawUser?.last_name || rawUser?.family_name || "";
  const role = rawUser?.role?.value;
  const id = rawUser?.id;

  const fallbackName = rawUser?.name || rawUser?.username || "User";

  const name = fullName(rawUser) || fallbackName;
  const email = rawUser?.email || "";
  const avatar = rawUser?.avatar || rawUser?.image || PLACEHOLDER_AVATAR;
  const student_no = rawUser?.student_no;

  return {
    id,
    name,
    role,
    email,
    avatar,
    firstName: first || "-",
    lastName: last || "-",
    student_no,
  };
}
