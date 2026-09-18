"use client";

import { ApiThumb } from "@core/types";
import { StudentRatingCategory } from "@core/types/student-ratings";

const SAT_CATEGORY_VALUE = 1;
const IELTS_CATEGORY_VALUE = 2;

export type ParsedCertificateField = {
  label: string;
  value: string | number | null | undefined;
};

export type ParsedCategoryCertificate = {
  kind: "sat" | "ielts" | null;
  result: Record<string, any> | null;
  certificate: ApiThumb | null;
  title: string;
  summary: string;
  fields: ParsedCertificateField[];
};

function asRecord(value: unknown): Record<string, any> | null {
  return value && typeof value === "object" ? (value as Record<string, any>) : null;
}

function asCertificate(value: unknown): ApiThumb | null {
  const record = asRecord(value);
  if (!record || typeof record.url !== "string" || !record.url.trim()) return null;
  return record as ApiThumb;
}

function normalizeValue(value: unknown): string {
  if (value === null || value === undefined || value === "") return "—";
  return String(value);
}

export function parseCategoryCertificate(
  category?: StudentRatingCategory | null
): ParsedCategoryCertificate {
  const result = asRecord(category?.result);
  const certificate = asCertificate(result?.certificate);

  if (category?.value === SAT_CATEGORY_VALUE) {
    const totalScore = normalizeValue(result?.total_score);
    return {
      kind: "sat",
      result,
      certificate,
      title: "SAT Certificate",
      summary: `Total Score: ${totalScore}`,
      fields: [
        { label: "Registration No", value: result?.registration_no },
        { label: "Total Score", value: result?.total_score },
        { label: "Math", value: result?.math_score },
        { label: "English", value: result?.english_score },
        { label: "Test Date", value: result?.test_date },
      ],
    };
  }

  if (category?.value === IELTS_CATEGORY_VALUE) {
    const overall = normalizeValue(result?.overall);
    return {
      kind: "ielts",
      result,
      certificate,
      title: "IELTS Certificate",
      summary: `Overall: ${overall}`,
      fields: [
        { label: "TRF Number", value: result?.trf_number },
        { label: "Overall", value: result?.overall },
        { label: "Listening", value: result?.listening },
        { label: "Reading", value: result?.reading },
        { label: "Writing", value: result?.writing },
        { label: "Speaking", value: result?.speaking },
        { label: "Test Date", value: result?.test_date },
        { label: "Expiry Date", value: result?.expiry_date },
      ],
    };
  }

  return {
    kind: null,
    result,
    certificate: null,
    title: "",
    summary: "",
    fields: [],
  };
}
