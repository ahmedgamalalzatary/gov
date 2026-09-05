import raw from "@/data/plan.json";

export type Kind =
  | "money"
  | "share"
  | "count"
  | "length"
  | "people"
  | "area"
  | "text";

/** One line item as published in خطة المواطن الاستثمارية, plus derived tags. */
export type PlanRow = {
  id: number;
  /** المحافظة */
  gov: string;
  govEn: string;
  year: string;
  yearRaw: string;
  /** the section heading the row sat under in the source document */
  section: string;
  /** derived: canonical sector */
  sector: string;
  /** derived: which spending track (general plan / حياة كريمة / تنمية الأسرة) */
  program: string;
  indicator: string;
  /** value verbatim from the source */
  value: string;
  /** leading number parsed out of `value`, when there is one */
  num: number | null;
  unit: string;
  /** derived: money | share | count | length | people | area | text */
  kind: Kind;
  /** money rows expressed in millions of EGP, for sorting */
  egpM: number | null;
  project: string;
  cost: string;
  agency: string;
  beneficiaries: string;
  source: string;
  /** page number in the source document, "" when it could not be recovered */
  page: string;
  notes: string;
  /** the compilers questioned this figure ("يحتاج مراجعة") */
  needsReview: boolean;
  /** the source gave no cost or beneficiary figure for this row */
  missingDetail: boolean;
  /** page number missing from the extracted text */
  pageMissing: boolean;
  file: string;
  /** the narrative document in public/ this row can be checked against */
  doc: string;
};

export type Governorate = {
  gov: string;
  govEn: string;
  /** إجمالي الاستثمارات العامة الموجهة للمحافظة، مليار جنيه */
  totalBn: number;
  sharePct: number;
  projects: number | null;
  popM: number | null;
  rows: number;
  topSectors: { sector: string; egpM: number }[];
};

export type Meta = {
  title: string;
  year: string;
  source: string;
  records: number;
  governorates: number;
  totalBn: number;
  needsReview: number;
  missingDetail: number;
  pageMissing: number;
  sectors: string[];
  programs: string[];
  kinds: Kind[];
  files: string[];
  docs: string[];
};

const data = raw as unknown as {
  meta: Meta;
  governorates: Governorate[];
  records: PlanRow[];
};

export const meta = data.meta;
export const governorates = data.governorates;
export const records = data.records;

export const KIND_LABEL: Record<Kind, string> = {
  money: "مبلغ مالي",
  share: "نسبة",
  count: "عدد",
  length: "طول",
  people: "سكان ومستفيدون",
  area: "مساحة",
  text: "بيان وصفي",
};

/** Figures stay in Latin digits (as in the source), thousands grouped. */
export function fmtNum(n: number): string {
  return n.toLocaleString("en-US", { maximumFractionDigits: 1 });
}

/** 29600 → "29.6 مليار جنيه"، 691.5 → "691.5 مليون جنيه" */
export function fmtEgpM(m: number): string {
  return m >= 1000
    ? `${fmtNum(m / 1000)} مليار جنيه`
    : `${fmtNum(m)} مليون جنيه`;
}
