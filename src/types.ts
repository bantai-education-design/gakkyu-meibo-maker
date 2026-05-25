export type Gender = "男" | "女" | "その他";

export type SortMode = "number" | "gender" | "kana" | "birthday" | "group" | "custom";

export type FontMode = "gothic" | "mincho";

export type PaperSize = "A4" | "A3" | "B4";

export type Orientation = "portrait" | "landscape";

export type TemplateType =
  | "standard"
  | "submission"
  | "reception"
  | "health"
  | "payment"
  | "group"
  | "birthday";

export interface VisibleColumns {
  gender: boolean;
  birthday: boolean;
  note: boolean;
  group: boolean;
}

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
  templateType: TemplateType;
  title: string;
  teacherName: string;
  showTeacherName: boolean;
  sortMode: SortMode;
  customOrder: string[];
  visibleColumns: VisibleColumns;
  layout: LayoutSettings;
}

export interface RosterTemplate {
  id: string;
  name: string;
  settings: RosterSettings;
}

export interface SavedRosterProject {
  version: string;
  savedAt: string;
  students: Student[];
  settings: RosterSettings;
  customOrder: string[];
  templates?: RosterTemplate[];
}
