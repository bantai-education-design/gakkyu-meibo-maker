import type { Student } from "../types";

export function normalizeCustomOrder(students: Student[], customOrder: string[] = []): string[] {
  const studentIds = new Set(students.map((student) => student.id));
  const orderedExistingIds = customOrder.filter((id) => studentIds.has(id));
  const orderedSet = new Set(orderedExistingIds);
  const missingIds = students
    .map((student) => student.id)
    .filter((id) => !orderedSet.has(id));

  return [...orderedExistingIds, ...missingIds];
}

export function orderStudentsByCustomOrder(students: Student[], customOrder: string[] = []): Student[] {
  const normalizedOrder = normalizeCustomOrder(students, customOrder);
  const orderIndex = new Map(normalizedOrder.map((id, index) => [id, index]));

  return [...students].sort((a, b) => {
    const aIndex = orderIndex.get(a.id) ?? Number.MAX_SAFE_INTEGER;
    const bIndex = orderIndex.get(b.id) ?? Number.MAX_SAFE_INTEGER;
    return aIndex - bIndex || a.number - b.number;
  });
}

export function moveStudentInCustomOrder(
  students: Student[],
  customOrder: string[] = [],
  studentId: string,
  direction: "up" | "down"
): string[] {
  const nextOrder = normalizeCustomOrder(students, customOrder);
  const currentIndex = nextOrder.indexOf(studentId);
  if (currentIndex === -1) return nextOrder;

  const nextIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
  if (nextIndex < 0 || nextIndex >= nextOrder.length) return nextOrder;

  [nextOrder[currentIndex], nextOrder[nextIndex]] = [nextOrder[nextIndex], nextOrder[currentIndex]];
  return nextOrder;
}
