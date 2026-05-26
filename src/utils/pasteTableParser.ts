import type { Student } from "../types";
import { convertRowsToStudents, inferColumnMapping } from "./csvColumnMapping";
import type { CsvImportResult } from "./parseCsv";

const defaultHeaders = ["番号", "姓", "名", "姓ふりがな", "名ふりがな", "性別", "班", "備考"];

export function parsePastedStudentTable(text: string): CsvImportResult {
  const rows = text
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .split("\n")
    .map((line) => line.split("\t").map((cell) => cell.trim()))
    .filter((row) => row.some((cell) => cell !== ""));

  if (rows.length === 0) {
    return { ok: false, message: "貼り付けデータが空です。" };
  }

  const hasHeader = isHeaderRow(rows[0]);
  const headers = hasHeader ? rows[0] : defaultHeaders.slice(0, rows[0].length);
  const dataRows = hasHeader ? rows.slice(1) : rows;

  if (dataRows.length === 0) {
    return { ok: false, message: "見出し行の下に児童データを入れてください。" };
  }

  return convertRowsToStudents(headers, dataRows, inferColumnMapping(headers));
}

export function mergeStudentsFromPaste(currentStudents: Student[], pastedStudents: Student[]): Student[] {
  const existingIds = new Set(currentStudents.map((student) => student.id));

  const normalizedPastedStudents = pastedStudents.map((student, index) => {
    const baseId = `paste-${Date.now()}-${index + 1}`;
    const id = existingIds.has(student.id) ? baseId : student.id || baseId;
    existingIds.add(id);
    return { ...student, id };
  });

  return [...currentStudents, ...normalizedPastedStudents];
}

export function replaceStudentsFromPaste(pastedStudents: Student[]): Student[] {
  return pastedStudents.map((student, index) => ({
    ...student,
    id: `paste-${Date.now()}-${index + 1}`
  }));
}

function isHeaderRow(row: string[]): boolean {
  const joined = row.join("");
  return /番号|出席番号|氏名|姓|名|ふりがな|性別|生年月日|班|グループ|備考|メモ/.test(joined);
}
