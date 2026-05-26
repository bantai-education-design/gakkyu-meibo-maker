import { useState } from "react";
import type { Student } from "../types";
import { AppLogo } from "./AppLogo";
import { PasteImportPanel } from "./PasteImportPanel";
import { StudentTableEditor } from "./StudentTableEditor";

interface DataEditorViewProps {
  students: Student[];
  onBackToPrint: () => void;
  onAddStudent: (student: Omit<Student, "id" | "visible">) => void;
  onUpdateStudent: (id: string, patch: Partial<Student>) => void;
  onDeleteStudent: (id: string) => void;
  onDeleteSelected: (ids: string[]) => void;
  onClearStudents: () => void;
  onRenumberStudents: () => void;
  onDeleteBlankStudents: () => void;
  onReplaceStudents: (students: Student[], message: string) => void;
}

function createBlankStudent(number: number): Omit<Student, "id" | "visible"> {
  return {
    number,
    fullName: undefined,
    lastName: "",
    firstName: "",
    fullKana: undefined,
    lastKana: "",
    firstKana: "",
    gender: "その他",
    birthday: "",
    group: "",
    note: ""
  };
}

export function DataEditorView({
  students,
  onBackToPrint,
  onAddStudent,
  onUpdateStudent,
  onDeleteStudent,
  onDeleteSelected,
  onClearStudents,
  onRenumberStudents,
  onDeleteBlankStudents,
  onReplaceStudents
}: DataEditorViewProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const nextNumber = students.reduce((max, student) => Math.max(max, student.number), 0) + 1;

  const addRow = () => {
    onAddStudent(createBlankStudent(nextNumber));
  };

  const deleteSelected = () => {
    if (selectedIds.length === 0) return;
    if (window.confirm("選択した児童を削除しますか？")) {
      onDeleteSelected(selectedIds);
      setSelectedIds([]);
    }
  };

  const clearStudents = () => {
    if (window.confirm("すべての児童データを削除しますか？")) {
      onClearStudents();
      setSelectedIds([]);
    }
  };

  const renumberStudents = () => {
    if (window.confirm("現在の順番で番号を1番から振り直します。よろしいですか？")) {
      onRenumberStudents();
    }
  };

  const deleteBlankStudents = () => {
    if (window.confirm("空白行を削除します。よろしいですか？")) {
      onDeleteBlankStudents();
      setSelectedIds([]);
    }
  };

  const deleteOne = (id: string) => {
    if (window.confirm("この児童を削除しますか？")) {
      onDeleteStudent(id);
      setSelectedIds((current) => current.filter((selectedId) => selectedId !== id));
    }
  };

  return (
    <main className="data-editor-view">
      <header className="data-editor-header">
        <AppLogo showTagline={false} />
        <div className="data-editor-heading">
          <h1>データ編集</h1>
          <p>名簿データを一覧表で入力・編集できます。</p>
        </div>
        <div className="view-switch">
          <button type="button" onClick={onBackToPrint}>
            印刷プレビューに戻る
          </button>
          <button type="button" className="active">
            データ編集
          </button>
        </div>
      </header>

      <div className="data-editor-actions">
        <button className="primary-action" type="button" onClick={addRow}>
          1行追加
        </button>
        <button className="secondary-button compact-action" type="button" onClick={addRow}>
          空行を追加
        </button>
        <button className="secondary-button compact-action" type="button" onClick={renumberStudents} disabled={students.length === 0}>
          番号を振り直す
        </button>
        <button className="secondary-button compact-action" type="button" onClick={deleteBlankStudents} disabled={students.length === 0}>
          空白行を削除
        </button>
        <button className="danger-button compact-action" type="button" onClick={deleteSelected} disabled={selectedIds.length === 0}>
          選択行を削除
        </button>
        <button className="danger-button compact-action" type="button" onClick={clearStudents} disabled={students.length === 0}>
          全データを消去
        </button>
      </div>

      <PasteImportPanel students={students} onReplaceStudents={onReplaceStudents} />
      <StudentTableEditor
        students={students}
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
        onUpdateStudent={onUpdateStudent}
        onDeleteStudent={deleteOne}
      />
    </main>
  );
}
