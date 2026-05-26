import type { Student } from "../types";

export interface StudentValidationIssue {
  type: "missing-number" | "duplicate-number" | "missing-name" | "missing-kana";
  label: string;
}

export function getStudentIssues(student: Student, students: Student[]): StudentValidationIssue[] {
  const issues: StudentValidationIssue[] = [];
  const hasName = Boolean((student.fullName || student.lastName || student.firstName).trim());
  const hasKana = Boolean((student.fullKana || student.lastKana || student.firstKana).trim());
  const sameNumberCount = students.filter((item) => item.number === student.number && student.number > 0).length;

  if (!student.number || !Number.isFinite(student.number)) {
    issues.push({ type: "missing-number", label: "番号未入力" });
  }

  if (student.number > 0 && sameNumberCount > 1) {
    issues.push({ type: "duplicate-number", label: "番号重複" });
  }

  if (!hasName) {
    issues.push({ type: "missing-name", label: "氏名未入力" });
  }

  if (hasName && !hasKana) {
    issues.push({ type: "missing-kana", label: "ふりがな未入力" });
  }

  return issues;
}

export function isBlankStudentRow(student: Student): boolean {
  const mainValues = [
    student.fullName,
    student.lastName,
    student.firstName,
    student.fullKana,
    student.lastKana,
    student.firstKana,
    student.birthday,
    student.group,
    student.note
  ];

  return mainValues.every((value) => (value ?? "").trim() === "");
}
