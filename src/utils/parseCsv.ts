import type { Gender, Student } from "../types";

export interface CsvImportSuccess {
  ok: true;
  students: Student[];
}

export interface CsvImportFailure {
  ok: false;
  message: string;
}

export type CsvImportResult = CsvImportSuccess | CsvImportFailure;

type CsvRow = Record<string, string>;

const supportedHeaders = [
  "出席番号",
  "番号",
  "氏名",
  "姓",
  "名",
  "ふりがな",
  "姓ふりがな",
  "名ふりがな",
  "性別",
  "生年月日",
  "備考",
  "班",
  "グループ"
];

export function parseStudentCsv(csvText: string): CsvImportResult {
  const rows = parseCsvRows(removeBom(csvText));

  if (rows.length < 2) {
    return { ok: false, message: "CSVに名簿データが見つかりませんでした。1行目に見出し、2行目以降に児童データを入れてください。" };
  }

  const headers = rows[0].map((header) => header.trim());
  const knownHeaderCount = headers.filter((header) => supportedHeaders.includes(header)).length;

  if (knownHeaderCount === 0) {
    return { ok: false, message: "見出し行を確認してください。「出席番号」「氏名」「姓」「名」などの列名に対応しています。" };
  }

  const dataRows = rows.slice(1).filter((row) => row.some((cell) => cell.trim() !== ""));
  const students = dataRows.map((row, index) => rowToStudent(toRecord(headers, row), index));

  if (students.length === 0) {
    return { ok: false, message: "読み込める児童データがありませんでした。CSVの2行目以降を確認してください。" };
  }

  return { ok: true, students };
}

function rowToStudent(row: CsvRow, index: number): Student {
  const numberText = pick(row, ["出席番号", "番号"]);
  const number = parseNumber(numberText, index + 1);
  const fullName = pick(row, ["氏名"]);
  const lastName = pick(row, ["姓"]) || fullName;
  const firstName = pick(row, ["名"]);
  const fullKana = pick(row, ["ふりがな"]);
  const lastKana = pick(row, ["姓ふりがな"]) || fullKana;
  const firstKana = pick(row, ["名ふりがな"]);

  return {
    id: `csv-${index + 1}-${number}`,
    number,
    fullName: fullName || undefined,
    lastName: lastName || "氏名未設定",
    firstName,
    fullKana: fullKana || undefined,
    lastKana,
    firstKana,
    gender: normalizeGender(pick(row, ["性別"])),
    birthday: pick(row, ["生年月日"]),
    group: pick(row, ["班", "グループ"]),
    note: pick(row, ["備考"]),
    visible: true
  };
}

function parseCsvRows(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let inQuotes = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];

    if (char === "\"") {
      if (inQuotes && next === "\"") {
        cell += "\"";
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === "," && !inQuotes) {
      row.push(cell);
      cell = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && next === "\n") index += 1;
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
      continue;
    }

    cell += char;
  }

  row.push(cell);
  rows.push(row);

  return rows.filter((cells) => cells.some((value) => value.trim() !== ""));
}

function toRecord(headers: string[], row: string[]): CsvRow {
  return headers.reduce<CsvRow>((record, header, index) => {
    if (header) record[header] = (row[index] ?? "").trim();
    return record;
  }, {});
}

function pick(row: CsvRow, keys: string[]): string {
  for (const key of keys) {
    const value = row[key]?.trim();
    if (value) return value;
  }
  return "";
}

function parseNumber(value: string, fallback: number): number {
  const parsed = Number(value.replace(/[^\d]/g, ""));
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function normalizeGender(value: string): Gender {
  if (value === "男" || value === "男子" || value.toLowerCase() === "m") return "男";
  if (value === "女" || value === "女子" || value.toLowerCase() === "f") return "女";
  return "その他";
}

function removeBom(text: string): string {
  return text.charCodeAt(0) === 0xfeff ? text.slice(1) : text;
}
