import type { RosterSettings, SavedRosterProject, Student } from "../types";
import { createSavedRosterProject, parseSavedRosterProject } from "./storage";

export function exportProjectAsJson(students: Student[], settings: RosterSettings): void {
  const project = createSavedRosterProject(students, settings);
  const json = JSON.stringify(project, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = createProjectFileName(settings.title);
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export async function importProjectFromJsonFile(file: File): Promise<SavedRosterProject> {
  if (!file.name.toLowerCase().endsWith(".json")) {
    throw new Error("このファイルはJSONファイルではありません。");
  }

  let text = "";
  try {
    text = await file.text();
  } catch {
    throw new Error("JSONファイルの読み込みに失敗しました。");
  }

  const project = parseSavedRosterProject(text);
  if (!project) {
    throw new Error("このファイルは学級名簿メーカーの保存ファイルではありません。保存ファイルの形式が古い、または壊れている可能性があります。");
  }

  return project;
}

function createProjectFileName(title: string): string {
  const now = new Date();
  const stamp = [
    now.getFullYear(),
    pad(now.getMonth() + 1),
    pad(now.getDate()),
    "_",
    pad(now.getHours()),
    pad(now.getMinutes())
  ].join("");
  const safeTitle = sanitizeFileName(title || "学級名簿");
  return `${safeTitle}_${stamp}.json`;
}

function sanitizeFileName(value: string): string {
  return value.replace(/[\\/:*?"<>|]/g, "_").trim().slice(0, 40) || "学級名簿メーカー";
}

function pad(value: number): string {
  return String(value).padStart(2, "0");
}
