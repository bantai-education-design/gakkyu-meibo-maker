import type { Gender, Student } from "../types";
import type { CsvImportResult } from "./parseCsv";

export type CsvStudentField =
  | "ignore"
  | "number"
  | "fullName"
  | "lastName"
  | "firstName"
  | "fullKana"
  | "lastKana"
  | "firstKana"
  | "gender"
  | "birthday"
  | "note"
  | "group";

export type CsvColumnMapping = Record<number, CsvStudentField>;

export const csvFieldOptions: Array<{ value: CsvStudentField; label: string }> = [
  { value: "ignore", label: "使用しない" },
  { value: "number", label: "出席番号" },
  { value: "fullName", label: "氏名" },
  { value: "lastName", label: "姓" },
  { value: "firstName", label: "名" },
  { value: "fullKana", label: "ふりがな" },
  { value: "lastKana", label: "姓ふりがな" },
  { value: "firstKana", label: "名ふりがな" },
  { value: "gender", label: "性別" },
  { value: "birthday", label: "生年月日" },
  { value: "note", label: "備考" },
  { value: "group", label: "班" },
  { value: "group", label: "グループ" }
];

const aliases: Record<string, CsvStudentField> = {
  出席番号: "number",
  番号: "number",
  氏名: "fullName",
  児童名: "fullName",
  名前: "fullName",
  姓名: "fullName",
  姓: "lastName",
  名: "firstName",
  ふりがな: "fullKana",
  フリガナ: "fullKana",
  よみ: "fullKana",
  読み: "fullKana",
  姓ふりがな: "lastKana",
  姓フリガナ: "lastKana",
  名ふりがな: "firstKana",
  名フリガナ: "firstKana",
  性別: "gender",
  男女: "gender",
  生年月日: "birthday",
  誕生日: "birthday",
  備考: "note",
  メモ: "note",
  班: "group",
  グループ: "group"
};

export function inferColumnMapping(headers: string[]): CsvColumnMapping {
  return headers.reduce<CsvColumnMapping>((mapping, header, index) => {
    mapping[index] = aliases[normalizeHeader(header)] ?? "ignore";
    return mapping;
  }, {});
}

export function validateColumnMapping(mapping: CsvColumnMapping): string[] {
  const selectedFields = Object.values(mapping).filter((field) => field !== "ignore");
  const duplicateFields = selectedFields.filter((field, index) => selectedFields.indexOf(field) !== index);
  const uniqueDuplicates = Array.from(new Set(duplicateFields));
  const messages: string[] = [];

  if (uniqueDuplicates.length > 0) {
    messages.push("同じ項目が複数の列に割り当てられています。重複している項目を確認してください。");
  }

  const hasFullName = selectedFields.includes("fullName");
  const hasSeparatedName = selectedFields.includes("lastName") || selectedFields.includes("firstName");
  if (!hasFullName && !hasSeparatedName) {
    messages.push("氏名または姓・名に該当する列がありません。");
  }

  return messages;
}

export function mappingWarnings(mapping: CsvColumnMapping): string[] {
  if (Object.values(mapping).includes("number")) return [];
  return ["出席番号がない場合は、自動で1番から番号を振ります。"];
}

export function convertRowsToStudents(
  headers: string[],
  rows: string[][],
  mapping: CsvColumnMapping
): CsvImportResult {
  const errors = validateColumnMapping(mapping);
  if (errors.length > 0) return { ok: false, message: errors.join(" ") };

  const students = rows
    .map((row, index) => rowToStudent(headers, row, mapping, index))
    .filter((student) => student.lastName.trim() !== "" || student.fullName?.trim());

  if (students.length === 0) {
    return { ok: false, message: "読み込める児童データがありません。" };
  }

  return { ok: true, students };
}

function rowToStudent(headers: string[], row: string[], mapping: CsvColumnMapping, index: number): Student {
  const record = Object.entries(mapping).reduce<Partial<Record<CsvStudentField, string>>>((result, [rawIndex, field]) => {
    if (field === "ignore") return result;
    const columnIndex = Number(rawIndex);
    result[field] = (row[columnIndex] ?? "").trim();
    return result;
  }, {});

  const number = parseNumber(record.number ?? "", index + 1);
  const fullName = record.fullName ?? "";
  const lastName = record.lastName || fullName;
  const firstName = record.firstName ?? "";
  const fullKana = record.fullKana ?? "";
  const lastKana = record.lastKana || fullKana;
  const firstKana = record.firstKana ?? "";

  return {
    id: `csv-${index + 1}-${number}-${headers.length}`,
    number,
    fullName: fullName || undefined,
    lastName: lastName || "氏名未設定",
    firstName,
    fullKana: fullKana || undefined,
    lastKana,
    firstKana,
    gender: normalizeGender(record.gender ?? ""),
    birthday: record.birthday ?? "",
    group: record.group ?? "",
    note: record.note ?? "",
    visible: true
  };
}

function normalizeHeader(header: string): string {
  return header.trim().replace(/\s+/g, "");
}

function parseNumber(value: string, fallback: number): number {
  const parsed = Number(value.replace(/[^\d]/g, ""));
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function normalizeGender(value: string): Gender {
  const normalized = value.trim().toLowerCase();
  if (value === "男" || value === "男子" || value === "男の子" || normalized === "m") return "男";
  if (value === "女" || value === "女子" || value === "女の子" || normalized === "f") return "女";
  return "その他";
}
