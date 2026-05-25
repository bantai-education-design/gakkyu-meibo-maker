import type { CSSProperties } from "react";
import type { RosterSettings, Student } from "../types";
import { groupForPreview } from "../utils/sortStudents";

interface RosterTableProps {
  students: Student[];
  settings: RosterSettings;
}

function NameDisplay({ student, showKana }: { student: Student; showKana: boolean }) {
  if (student.fullName && !student.firstName) {
    return (
      <span className="full-name-text">
        {showKana && student.fullKana ? (
          <ruby>
            {student.fullName}
            <rt>{student.fullKana}</rt>
          </ruby>
        ) : (
          <span>{student.fullName}</span>
        )}
      </span>
    );
  }

  if (!showKana) {
    return (
      <span className="full-name-text">
        <span>{student.lastName}</span>
        <span>{student.firstName}</span>
      </span>
    );
  }

  return (
    <span className="full-name-text with-kana">
      <ruby>
        {student.lastName}
        <rt>{student.lastKana}</rt>
      </ruby>
      <ruby>
        {student.firstName}
        <rt>{student.firstKana}</rt>
      </ruby>
    </span>
  );
}

function TableBlock({
  students,
  settings,
  heading
}: {
  students: Student[];
  settings: RosterSettings;
  heading?: string;
}) {
  const checks = Array.from({ length: settings.layout.checkColumnCount }, (_, index) => index + 1);
  const visibleColumns = settings.visibleColumns;
  const isTwoColumn = settings.layout.columns === 2;
  const hasManyChecks = settings.layout.checkColumnCount >= 10;
  const nameColumnWidth = isTwoColumn
    ? Math.min(settings.layout.nameColumnWidth, 92)
    : hasManyChecks
      ? Math.min(settings.layout.nameColumnWidth, 112)
      : settings.layout.nameColumnWidth;
  const checkColumnWidth = isTwoColumn && hasManyChecks
    ? Math.min(settings.layout.checkColumnMinWidth, 14)
    : hasManyChecks
      ? Math.min(settings.layout.checkColumnMinWidth, 18)
      : settings.layout.checkColumnMinWidth;
  const tableStyle = {
    "--number-column-width": `${isTwoColumn ? Math.min(settings.layout.numberColumnWidth, 32) : settings.layout.numberColumnWidth}px`,
    "--name-column-width": `${nameColumnWidth}px`,
    "--check-column-min-width": `${checkColumnWidth}px`
  } as CSSProperties;

  return (
    <div className="table-block">
      {heading ? <div className="block-heading">{heading}</div> : null}
      <table className="roster-table" style={tableStyle}>
        <colgroup>
          <col className="number-col" />
          <col className="name-col" />
          {visibleColumns.gender ? <col className="gender-col" /> : null}
          {visibleColumns.birthday ? <col className="birthday-col" /> : null}
          {visibleColumns.group ? <col className="group-col" /> : null}
          {checks.map((check) => (
            <col className="check-col" key={`check-col-${check}`} />
          ))}
          {visibleColumns.note ? <col className="note-col" /> : null}
        </colgroup>
        <thead>
          <tr>
            <th className="number-col">番号</th>
            <th className="name-col">氏名</th>
            {visibleColumns.gender ? <th className="gender-col">性別</th> : null}
            {visibleColumns.birthday ? <th className="birthday-col">生年月日</th> : null}
            {visibleColumns.group ? <th className="group-col">班</th> : null}
            {checks.map((check) => (
              <th className="check-col" key={check}>{check}</th>
            ))}
            {visibleColumns.note ? <th className="note-col">備考</th> : null}
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <td className="number-col">{student.number}</td>
              <td className="name-col">
                <NameDisplay student={student} showKana={settings.layout.showKana} />
              </td>
              {visibleColumns.gender ? <td className="gender-col">{student.gender}</td> : null}
              {visibleColumns.birthday ? <td className="birthday-col">{student.birthday}</td> : null}
              {visibleColumns.group ? <td className="group-col">{student.group}</td> : null}
              {checks.map((check) => (
                <td className="check-col" key={`${student.id}-${check}`} />
              ))}
              {visibleColumns.note ? <td className="note-col">{student.note}</td> : null}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function RosterTable({ students, settings }: RosterTableProps) {
  const shouldSplitGender =
    settings.sortMode === "gender" &&
    settings.layout.splitGenderColumns &&
    settings.layout.columns === 2;

  const groups = shouldSplitGender
    ? groupForPreview(students, settings.sortMode, true)
    : splitForColumns(students, settings.layout.columns);

  const headings = shouldSplitGender ? ["男子", "女子", "その他"] : [];

  return (
    <div className={`roster-columns columns-${settings.layout.columns}`}>
      {groups.map((group, index) => (
        <TableBlock
          key={`${headings[index] ?? "all"}-${index}`}
          students={group}
          settings={settings}
          heading={headings[index]}
        />
      ))}
    </div>
  );
}

function splitForColumns(students: Student[], columns: 1 | 2): Student[][] {
  if (columns === 1) return [students];
  const midpoint = Math.ceil(students.length / 2);
  return [students.slice(0, midpoint), students.slice(midpoint)];
}
