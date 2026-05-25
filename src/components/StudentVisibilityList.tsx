import type { Student } from "../types";

interface StudentVisibilityListProps {
  students: Student[];
  onToggle: (id: string) => void;
}

export function StudentVisibilityList({ students, onToggle }: StudentVisibilityListProps) {
  return (
    <div className="student-list">
      {students.map((student) => (
        <label className="student-toggle" key={student.id}>
          <input
            type="checkbox"
            checked={student.visible}
            onChange={() => onToggle(student.id)}
          />
          <span className="student-number">{student.number}</span>
          <span className="student-label">
            {student.lastName} {student.firstName}
          </span>
          <span className={`gender-chip gender-${student.gender}`}>{student.gender}</span>
        </label>
      ))}
    </div>
  );
}
