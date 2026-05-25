import type { RosterSettings, TemplateType } from "../types";

export interface RosterPurposeTemplate {
  type: TemplateType;
  name: string;
  description: string;
  settings: Pick<RosterSettings, "title" | "sortMode" | "visibleColumns"> & {
    checkColumnCount: number;
    showKana: boolean;
  };
}

export const rosterTemplates: RosterPurposeTemplate[] = [
  {
    type: "standard",
    name: "通常名簿",
    description: "基本の学級名簿です。",
    settings: {
      title: "学級名簿",
      checkColumnCount: 0,
      showKana: true,
      sortMode: "number",
      visibleColumns: { gender: false, birthday: false, note: false, group: true }
    }
  },
  {
    type: "submission",
    name: "提出物チェック表",
    description: "提出物を複数回チェックできます。",
    settings: {
      title: "提出物チェック表",
      checkColumnCount: 5,
      showKana: true,
      sortMode: "number",
      visibleColumns: { gender: false, birthday: false, note: true, group: false }
    }
  },
  {
    type: "reception",
    name: "保護者会受付名簿",
    description: "受付確認とメモに使えます。",
    settings: {
      title: "保護者会受付名簿",
      checkColumnCount: 2,
      showKana: true,
      sortMode: "number",
      visibleColumns: { gender: false, birthday: false, note: true, group: false }
    }
  },
  {
    type: "health",
    name: "健康観察表",
    description: "日々の確認欄と備考欄を使います。",
    settings: {
      title: "健康観察表",
      checkColumnCount: 5,
      showKana: true,
      sortMode: "number",
      visibleColumns: { gender: false, birthday: false, note: true, group: false }
    }
  },
  {
    type: "payment",
    name: "集金確認表",
    description: "集金の確認欄を用意します。",
    settings: {
      title: "集金確認表",
      checkColumnCount: 3,
      showKana: true,
      sortMode: "number",
      visibleColumns: { gender: false, birthday: false, note: true, group: false }
    }
  },
  {
    type: "group",
    name: "班別名簿",
    description: "班やグループを見やすくします。",
    settings: {
      title: "班別名簿",
      checkColumnCount: 0,
      showKana: true,
      sortMode: "group",
      visibleColumns: { gender: false, birthday: false, note: false, group: true }
    }
  },
  {
    type: "birthday",
    name: "誕生日一覧",
    description: "生年月日順に並べます。",
    settings: {
      title: "誕生日一覧",
      checkColumnCount: 0,
      showKana: true,
      sortMode: "birthday",
      visibleColumns: { gender: false, birthday: true, note: false, group: false }
    }
  }
];

export function applyTemplate(settings: RosterSettings, templateType: TemplateType): RosterSettings {
  const template = rosterTemplates.find((item) => item.type === templateType);
  if (!template) return settings;

  return {
    ...settings,
    templateType,
    title: template.settings.title,
    sortMode: template.settings.sortMode,
    visibleColumns: template.settings.visibleColumns,
    layout: {
      ...settings.layout,
      checkColumnCount: template.settings.checkColumnCount,
      showKana: template.settings.showKana
    }
  };
}
