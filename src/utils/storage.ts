import type { RosterSettings, SavedRosterProject, Student } from "../types";

const STORAGE_KEY = "class-roster-maker.project.v1";

export function createSavedRosterProject(
  students: Student[],
  settings: RosterSettings
): SavedRosterProject {
  return {
    version: "1",
    savedAt: new Date().toISOString(),
    students,
    settings,
    templates: []
  };
}

export function saveRosterProject(students: Student[], settings: RosterSettings): SavedRosterProject {
  const project = createSavedRosterProject(students, settings);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(project));
  return project;
}

export function loadRosterProject(): SavedRosterProject | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    return parseSavedRosterProject(raw);
  } catch {
    return null;
  }
}

export function deleteRosterProject(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function hasSavedRosterProject(): boolean {
  return localStorage.getItem(STORAGE_KEY) !== null;
}

export function parseSavedRosterProject(raw: string): SavedRosterProject | null {
  try {
    const parsed = JSON.parse(raw) as SavedRosterProject;
    if (!isSavedRosterProject(parsed)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function isSavedRosterProject(value: unknown): value is SavedRosterProject {
  if (!value || typeof value !== "object") return false;
  const project = value as Partial<SavedRosterProject>;
  return (
    typeof project.version === "string" &&
    typeof project.savedAt === "string" &&
    Array.isArray(project.students) &&
    !!project.settings &&
    typeof project.settings === "object"
  );
}
