import toast from "react-hot-toast";

// const so = new Set([
//   "first_name",
//   "last_name",
//   "middle_name",
//   "date_of_birth",
//   "gender",
//   "avatar_url",
//   "email",
//   "phone_number",
//   "registration_no",
//   "total_score",
//   "math_score",
//   "english_score",
//   "test_date",
//   "certificate_attachment_id",
//   "trf_number",
//   "overall",
//   "listening",
//   "reading",
//   "writing",
//   "speaking",
//   "expiry_date",
//   "passport_number",
//   "passport_file_id",
//   "citizenship_id",
//   "nationality_id",
//   "pinfl",
//   "given_place",
//   "given_date",
//   "type",
//   "act_number",
//   "expire_date",
//   "title",
//   "subject",
//   "level_id",
//   "award",
//   "description",
//   "date_awarded",
//   "parent_full_name",
//   "parent_phone",
//   "region_id",
//   "district_id",
//   "address",
//   "school_id",
//   "graduation_year",
//   "gpa",
//   "transcript_file_id",
//   "region",
//   "district",
//   "educationName",
// ]);

// export function showApiErrors(e: any) {
//   const errors = e?.response?.data?.errors ?? {};

//   Object.values(errors).forEach((messages) => {
//     // if (!so.has(field)) return; 
//     if (Array.isArray(messages) && messages.length > 0) {
//       toast.error(String(messages?.[0]));
//     }
//   });
// }

export function showApiErrors(e: any) {
  const errors = e?.response?.data?.errors;

  if (!errors || typeof errors !== "object") {
    if (e?.response?.data?.message === "Student create access is currently closed for your role.") return toast.error(e?.response?.data?.message || "You don't have permission to perform this action.");
    toast.error("Something went wrong. Please try again!");
    return;
  }

  Object.entries(errors).forEach(([_, messages]) => {
    const msg = Array.isArray(messages) ? messages[0] : messages;
    if (msg) {
      toast.error(String(msg));
    }
  });
}