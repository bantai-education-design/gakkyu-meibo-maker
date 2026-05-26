import { useState } from "react";
import type { Gender, Student } from "../types";

type StudentDraft = Omit<Student, "id" | "visible">;

interface ManualStudentPanelProps {
  students: Student[];
  onAddStudent: (student: StudentDraft) => void;
  onUpdateStudent: (id: string, patch: Partial<Student>) => void;
  onDeleteStudent: (id: string) => void;
}

const emptyDraft: StudentDraft = {
  number: 1,
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

function createNextDraft(students: Student[]): StudentDraft {
  const nextNumber = students.reduce((max, student) => Math.max(max, student.number), 0) + 1;
  return { ...emptyDraft, number: nextNumber };
}

export function ManualStudentPanel({
  students,
  onAddStudent,
  onUpdateStudent,
  onDeleteStudent
}: ManualStudentPanelProps) {
  const [draft, setDraft] = useState<StudentDraft>(() => createNextDraft(students));
  const [message, setMessage] = useState("");

  const updateDraft = <K extends keyof StudentDraft>(key: K, value: StudentDraft[K]) => {
    setDraft((current) => ({ ...current, [key]: value }));
  };

  const addStudent = () => {
    if (!draft.lastName.trim() && !draft.firstName.trim()) {
      setMessage("姓または名を入力してください。");
      return;
    }

    onAddStudent({
      ...draft,
      number: Number.isFinite(draft.number) && draft.number > 0 ? draft.number : students.length + 1,
      lastName: draft.lastName.trim(),
      firstName: draft.firstName.trim(),
      lastKana: draft.lastKana.trim(),
      firstKana: draft.firstKana.trim(),
      birthday: draft.birthday.trim(),
      group: draft.group.trim(),
      note: draft.note.trim()
    });
    setDraft(createNextDraft([...students, { ...draft, id: "preview", visible: true }]));
    setMessage("児童を追加しました。");
  };

  const deleteStudent = (student: Student) => {
    const name = student.fullName || `${student.lastName} ${student.firstName}`.trim();
    if (window.confirm(`${name || "この児童"}を削除しますか？`)) {
      onDeleteStudent(student.id);
      setMessage("児童を削除しました。");
    }
  };

  return (
    <div className="manual-panel">
      <details className="inner-details">
        <summary>簡易追加</summary>
        <div className="manual-form">
          <label className="field compact-field">
            <span>番号</span>
            <input
              type="number"
              min="1"
              value={draft.number}
              onChange={(event) => updateDraft("number", Number(event.target.value))}
            />
          </label>
          <label className="field compact-field">
            <span>姓</span>
            <input value={draft.lastName} onChange={(event) => updateDraft("lastName", event.target.value)} />
          </label>
          <label className="field compact-field">
            <span>名</span>
            <input value={draft.firstName} onChange={(event) => updateDraft("firstName", event.target.value)} />
          </label>
          <label className="field compact-field">
            <span>姓ふりがな</span>
            <input value={draft.lastKana} onChange={(event) => updateDraft("lastKana", event.target.value)} />
          </label>
          <label className="field compact-field">
            <span>名ふりがな</span>
            <input value={draft.firstKana} onChange={(event) => updateDraft("firstKana", event.target.value)} />
          </label>
          <label className="field compact-field">
            <span>性別</span>
            <select value={draft.gender} onChange={(event) => updateDraft("gender", event.target.value as Gender)}>
              <option value="その他">その他</option>
              <option value="男">男</option>
              <option value="女">女</option>
            </select>
          </label>
          <label className="field compact-field">
            <span>生年月日</span>
            <input
              value={draft.birthday}
              onChange={(event) => updateDraft("birthday", event.target.value)}
              placeholder="2017-04-01"
            />
          </label>
          <label className="field compact-field">
            <span>班・グループ</span>
            <input value={draft.group} onChange={(event) => updateDraft("group", event.target.value)} />
          </label>
          <label className="field compact-field wide-field">
            <span>備考</span>
            <input value={draft.note} onChange={(event) => updateDraft("note", event.target.value)} />
          </label>
        </div>
        <button className="secondary-button compact-action" type="button" onClick={addStudent}>
          追加
        </button>
      </details>

      <details className="inner-details">
        <summary>児童一覧を編集</summary>
        <div className="manual-edit-list">
          {students.map((student) => (
            <details className="student-edit-card" key={student.id}>
              <summary>
                <span>{student.number}</span>
                <strong>{student.fullName || `${student.lastName} ${student.firstName}`.trim()}</strong>
              </summary>
              <div className="manual-form">
                <label className="check-row wide-field">
                  <input
                    type="checkbox"
                    checked={student.visible}
                    onChange={(event) => onUpdateStudent(student.id, { visible: event.target.checked })}
                  />
                  <span>表示する</span>
                </label>
                <label className="field compact-field">
                  <span>番号</span>
                  <input
                    type="number"
                    min="1"
                    value={student.number}
                    onChange={(event) => onUpdateStudent(student.id, { number: Number(event.target.value) })}
                  />
                </label>
                <label className="field compact-field">
                  <span>姓</span>
                  <input value={student.lastName} onChange={(event) => onUpdateStudent(student.id, { lastName: event.target.value, fullName: undefined })} />
                </label>
                <label className="field compact-field">
                  <span>名</span>
                  <input value={student.firstName} onChange={(event) => onUpdateStudent(student.id, { firstName: event.target.value, fullName: undefined })} />
                </label>
                <label className="field compact-field">
                  <span>姓ふりがな</span>
                  <input value={student.lastKana} onChange={(event) => onUpdateStudent(student.id, { lastKana: event.target.value, fullKana: undefined })} />
                </label>
                <label className="field compact-field">
                  <span>名ふりがな</span>
                  <input value={student.firstKana} onChange={(event) => onUpdateStudent(student.id, { firstKana: event.target.value, fullKana: undefined })} />
                </label>
                <label className="field compact-field">
                  <span>班・グループ</span>
                  <input value={student.group} onChange={(event) => onUpdateStudent(student.id, { group: event.target.value })} />
                </label>
                <label className="field compact-field wide-field">
                  <span>備考</span>
                  <input value={student.note} onChange={(event) => onUpdateStudent(student.id, { note: event.target.value })} />
                </label>
              </div>
              <button className="danger-button compact-action" type="button" onClick={() => deleteStudent(student)}>
                この児童を削除
              </button>
            </details>
          ))}
        </div>
      </details>

      {message ? <div className="storage-message">{message}</div> : null}
    </div>
  );
}
