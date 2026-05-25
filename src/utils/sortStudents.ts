import type { SortMode, Student } from "../types";
import { orderStudentsByCustomOrder } from "./customOrder";

const genderOrder = new Map([
  ["男", 1],
  ["女", 2],
  ["その他", 3]
]);

export function sortStudents(students: Student[], sortMode: SortMode, customOrder: string[] = []): Student[] {
  const visibleStudents = students.filter((student) => student.visible);

  if (sortMode === "custom") {
    return orderStudentsByCustomOrder(visibleStudents, customOrder);
  }

  return [...visibleStudents].sort((a, b) => {
    if (sortMode === "gender") {
      const genderDiff = (genderOrder.get(a.gender) ?? 9) - (genderOrder.get(b.gender) ?? 9);
      if (genderDiff !== 0) return genderDiff;
      return a.number - b.number;
    }

    if (sortMode === "kana") {
      const kanaA = a.fullKana || `${a.lastKana}${a.firstKana}`;
      const kanaB = b.fullKana || `${b.lastKana}${b.firstKana}`;
      return kanaA.localeCompare(kanaB, "ja") || a.number - b.number;
    }

    if (sortMode === "birthday") {
      return a.birthday.localeCompare(b.birthday) || a.number - b.number;
    }

    if (sortMode === "group") {
      return a.group.localeCompare(b.group, "ja", { numeric: true }) || a.number - b.number;
    }

    return a.number - b.number;
  });
}

export function groupForPreview(students: Student[], sortMode: SortMode, splitGenderColumns: boolean): Student[][] {
  if (sortMode === "gender" && splitGenderColumns) {
    const boys = students.filter((student) => student.gender === "男");
    const girls = students.filter((student) => student.gender === "女");
    const others = students.filter((student) => student.gender !== "男" && student.gender !== "女");
    return others.length > 0 ? [boys, girls, others] : [boys, girls];
  }

  return [students];
}
