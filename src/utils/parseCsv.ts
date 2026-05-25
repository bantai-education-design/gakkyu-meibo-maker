import type { Student } from "../types";
import { convertRowsToStudents, inferColumnMapping, type CsvColumnMapping } from "./csvColumnMapping";

export type CsvEncoding = "utf-8" | "shift_jis";

export interface CsvTable {
  headers: string[];
  rows: string[][];
}

export interface CsvImportSuccess {
  ok: true;
  students: Student[];
}

export interface CsvImportFailure {
  ok: false;
  message: string;
}

export type CsvImportResult = CsvImportSuccess | CsvImportFailure;

export type CsvTableResult = { ok: true; table: CsvTable } | CsvImportFailure;

export function decodeCsvBuffer(buffer: ArrayBuffer, encoding: CsvEncoding): string {
  const decoder = new TextDecoder(encoding, { fatal: false });
  return decoder.decode(buffer);
}

export function hasPossibleMojibake(text: string): boolean {
  return /�|縺|繧|繝|譁|蜷|逕|螂|莠|蛻|髯|霎|謠|邱/.test(text);
}

export function parseCsvTable(csvText: string): CsvTableResult {
  const rows = parseCsvRows(removeBom(csvText));

  if (rows.length < 2) {
    return { ok: false, message: "CSVに名簿データが見つかりませんでした。1行目に見出し、2行目以降に児童データを入れてください。" };
  }

  const headers = rows[0].map((header) => header.trim());
  const dataRows = rows.slice(1).filter((row) => row.some((cell) => cell.trim() !== ""));

  if (headers.length === 0 || headers.every((header) => header === "")) {
    return { ok: false, message: "CSVの見出し行が空です。1行目に列名を入れてください。" };
  }

  if (dataRows.length === 0) {
    return { ok: false, message: "読み込める児童データがありません。CSVの2行目以降を確認してください。" };
  }

  return { ok: true, table: { headers, rows: dataRows } };
}

export function parseStudentCsv(csvText: string, mapping?: CsvColumnMapping): CsvImportResult {
  const tableResult = parseCsvTable(csvText);
  if (tableResult.ok === false) return tableResult;

  return convertRowsToStudents(
    tableResult.table.headers,
    tableResult.table.rows,
    mapping ?? inferColumnMapping(tableResult.table.headers)
  );
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

function removeBom(text: string): string {
  return text.charCodeAt(0) === 0xfeff ? text.slice(1) : text;
}
