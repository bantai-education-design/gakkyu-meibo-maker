import type { Student } from "../types";

interface StudentVisibilityListProps {
  students: Student[];
  isCustomOrder: boolean;
  onToggle: (id: string) => void;
  onMove: (id: string, direction: "up" | "down") => void;
  onGroupChange: (id: string, group: string) => void;
}

export function StudentVisibilityList({
  students,
  isCustomOrder,
  onToggle,
  onMove,
  onGroupChange
}: StudentVisibilityListProps) {
  return (
    <div className="student-list">
      {!isCustomOrder ? (
        <p className="student-list-note">任意順を選ぶと、上下ボタンで並び替えできます。</p>
      ) : null}
      {students.map((student, index) => (
        <div className="student-toggle" key={student.id}>
          <label className="student-visible-check">
            <input
              type="checkbox"
              checked={student.visible}
              onChange={() => onToggle(student.id)}
            />
          </label>
          <span className="student-number">{student.number}</span>
          <span className="student-label">
            {student.fullName || `${student.lastName} ${student.firstName}`.trim()}
          </span>
          <span className={`gender-chip gender-${student.gender}`}>{student.gender}</span>
          <div className="student-order-actions" aria-label="任意順の移動">
            <button
              type="button"
              onClick={() => onMove(student.id, "up")}
              disabled={!isCustomOrder || index === 0}
            >
              ↑
            </button>
            <button
              type="button"
              onClick={() => onMove(student.id, "down")}
              disabled={!isCustomOrder || index === students.length - 1}
            >
              ↓
            </button>
          </div>
          <label className="student-group-field">
            <span>班</span>
            <input
              value={student.group}
              onChange={(event) => onGroupChange(student.id, event.target.value)}
              placeholder="1班"
            />
          </label>
        </div>
      ))}
    </div>
  );
}
