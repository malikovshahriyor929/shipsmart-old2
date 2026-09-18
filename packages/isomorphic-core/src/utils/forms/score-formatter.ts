const keepDigitsAndOneDot = (s: string) => {
  s = s.replace(/[^\d.]/g, "");
  const firstDot = s.indexOf(".");
  if (firstDot !== -1) {
    s = s.slice(0, firstDot + 1) + s.slice(firstDot + 1).replace(/\./g, "");
  }
  return s;
};

/**
 * IELTS overall formatter (keeps trailing "." while typing).
 * Clamps integer to [4..9]. Forces decimal to 0 or 5 when present.
 */
export const formatIeltsScoreInput = (raw: string) => {
  let v = keepDigitsAndOneDot(raw);

  // If user typed two digits without a dot, auto-insert one: "65" -> "6.5"
  if (!v.includes(".") && v.length >= 2) v = `${v[0]}.${v[1]}`;

  // If it's just a dot, treat as empty
  if (v === ".") return "";

  const hadTrailingDot = v.endsWith("."); // <-- preserve a trailing dot
  const [i = "", d = ""] = v.split(".");

  // One integer digit, strip leading zeros
  let intPart = i.replace(/^0+/, "").slice(0, 1);
  if (intPart && +intPart > 9) intPart = "9";
  if (intPart && +intPart < 4) intPart = "4"; // overall min 4

  // One decimal digit; force to 0 or 5
  let decPart = d.slice(0, 1);
  if (decPart && decPart !== "0" && decPart !== "5") {
    decPart = "0";
  }

  // If the user just typed the dot and no decimal yet, keep it visible
  if (hadTrailingDot && !decPart) return intPart ? `${intPart}.` : "";

  return decPart ? `${intPart}.${decPart}` : intPart;
};

/**
 * OPTIONAL: breakdown formatter (Reading/Listening/Writing/Speaking).
 * Same trailing-dot fix, but min integer is 2 instead of 4.
 */
export const formatIeltsBreakdownInput = (raw: string) => {
  let v = keepDigitsAndOneDot(raw);

  if (!v.includes(".") && v.length >= 2) v = `${v[0]}.${v[1]}`;
  if (v === ".") return "";

  const hadTrailingDot = v.endsWith(".");
  const [i = "", d = ""] = v.split(".");

  let intPart = i.replace(/^0+/, "").slice(0, 1);
  if (intPart && +intPart > 9) intPart = "9";
  if (intPart && +intPart < 2) intPart = "2"; // breakdown min 2

  let decPart = d.slice(0, 1);
  if (decPart && decPart !== "0" && decPart !== "5") {
    decPart = "0";
  }

  if (hadTrailingDot && !decPart) return intPart ? `${intPart}.` : "";
  return decPart ? `${intPart}.${decPart}` : intPart;
};

export const formatSatTotalInput = (raw: string) => {
  let v = raw.replace(/\D/g, "");
  const n = parseInt(v || "0", 10);
  if (!Number.isNaN(n)) {
    if (n > 1600) v = "1600";
    if (n < 0) v = "0";
  }
  return v;
};

export const formatSatSectionInput = (raw: string) => {
  let v = raw.replace(/\D/g, "").slice(0, 3);
  if (!v) return v;

  if (v.length === 3) {
    // Force last digit to 0
    v = v.slice(0, 2) + "0";
    const n = parseInt(v, 10);
    if (n < 200) return "200";
    if (n > 800) return "800";
  }
  return v;
};
