export type Gender = "男" | "女" | "その他";

export type SortMode = "number" | "gender" | "kana" | "birthday";

export type FontMode = "gothic" | "mincho";

export type PaperSize = "A4" | "A3" | "B4";

export type Orientation = "portrait" | "landscape";

export interface Student {
  id: string;
  number: number;
  fullName?: string;
  lastName: string;
  firstName: string;
  fullKana?: string;
  lastKana: string;
  firstKana: string;
  gender: Gender;
  birthday: string;
  group: string;
  note: string;
  visible: boolean;
}

export interface LayoutSettings {
  columns: 1 | 2;
  checkColumnCount: number;
  showKana: boolean;
  fontMode: FontMode;
  rowGap: number;
  marginMm: number;
  paperSize: PaperSize;
  orientation: Orientation;
  splitGenderColumns: boolean;
}

export interface RosterSettings {
  title: string;
  teacherName: string;
  showTeacherName: boolean;
  sortMode: SortMode;
  layout: LayoutSettings;
}

export interface RosterTemplate {
  id: string;
  name: string;
  settings: RosterSettings;
}

export interface SavedRosterProject {
  version: 1;
  students: Student[];
  settings: RosterSettings;
  templates: RosterTemplate[];
}
