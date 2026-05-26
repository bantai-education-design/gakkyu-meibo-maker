import type { Gender, Student } from "../types";
import { getStudentIssues } from "../utils/studentValidation";

interface StudentTableEditorProps {
  students: Student[];
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
  onUpdateStudent: (id: string, patch: Partial<Student>) => void;
  onDeleteStudent: (id: string) => void;
}

export function StudentTableEditor({
  students,
  selectedIds,
  onSelectionChange,
  onUpdateStudent,
  onDeleteStudent
}: StudentTableEditorProps) {
  const selectedSet = new Set(selectedIds);
  const toggleAll = (checked: boolean) => {
    onSelectionChange(checked ? students.map((student) => student.id) : []);
  };
  const toggleOne = (id: string, checked: boolean) => {
    onSelectionChange(checked ? [...selectedIds, id] : selectedIds.filter((selectedId) => selectedId !== id));
  };

  return (
    <section className="data-card table-editor-card">
      <div className="data-card-title">
        <h2>児童一覧を編集</h2>
        <p>{students.length}人のデータを一覧表で編集できます。</p>
      </div>
      <div className="student-table-scroll">
        <table className="student-editor-table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={students.length > 0 && selectedIds.length === students.length}
                  onChange={(event) => toggleAll(event.target.checked)}
                  aria-label="すべて選択"
                />
              </th>
              <th>表示</th>
              <th>番号</th>
              <th>姓</th>
              <th>名</th>
              <th>姓ふりがな</th>
              <th>名ふりがな</th>
              <th>性別</th>
              <th>生年月日</th>
              <th>班・グループ</th>
              <th>備考</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => {
              const issues = getStudentIssues(student, students);

              return (
              <tr className={issues.length > 0 ? "student-row-has-issues" : ""} key={student.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedSet.has(student.id)}
                    onChange={(event) => toggleOne(student.id, event.target.checked)}
                    aria-label={`${student.number}番を選択`}
                  />
                </td>
                <td>
                  <input
                    type="checkbox"
                    checked={student.visible}
                    onChange={(event) => onUpdateStudent(student.id, { visible: event.target.checked })}
                    aria-label="表示"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    min="1"
                    value={student.number}
                    onChange={(event) => onUpdateStudent(student.id, { number: Number(event.target.value) })}
                  />
                </td>
                <td>
                  <input value={student.lastName} onChange={(event) => onUpdateStudent(student.id, { lastName: event.target.value, fullName: undefined })} />
                </td>
                <td>
                  <input value={student.firstName} onChange={(event) => onUpdateStudent(student.id, { firstName: event.target.value, fullName: undefined })} />
                </td>
                <td>
                  <input value={student.lastKana} onChange={(event) => onUpdateStudent(student.id, { lastKana: event.target.value, fullKana: undefined })} />
                </td>
                <td>
                  <input value={student.firstKana} onChange={(event) => onUpdateStudent(student.id, { firstKana: event.target.value, fullKana: undefined })} />
                </td>
                <td>
                  <select value={student.gender} onChange={(event) => onUpdateStudent(student.id, { gender: event.target.value as Gender })}>
                    <option value="男">男</option>
                    <option value="女">女</option>
                    <option value="その他">その他</option>
                  </select>
                </td>
                <td>
                  <input value={student.birthday} onChange={(event) => onUpdateStudent(student.id, { birthday: event.target.value })} placeholder="2017-04-01" />
                </td>
                <td>
                  <input value={student.group} onChange={(event) => onUpdateStudent(student.id, { group: event.target.value })} />
                </td>
                <td>
                  <input value={student.note} onChange={(event) => onUpdateStudent(student.id, { note: event.target.value })} />
                  {issues.length > 0 ? (
                    <div className="student-issues">
                      {issues.map((issue) => (
                        <span className={`student-issue issue-${issue.type}`} key={issue.type}>
                          {issue.label}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </td>
                <td>
                  <button className="small-danger-button" type="button" onClick={() => onDeleteStudent(student.id)}>
                    削除
                  </button>
                </td>
              </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
