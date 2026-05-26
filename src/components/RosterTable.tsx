import type { CSSProperties } from "react";
import type { NameDisplayMode, RosterSettings, Student } from "../types";
import { groupForPreview } from "../utils/sortStudents";

interface RosterTableProps {
  students: Student[];
  settings: RosterSettings;
}

function getNameLengthClass(value: string): string {
  const length = Array.from(value.replace(/\s/g, "")).length;
  if (length >= 7) return "name-length-long";
  if (length === 6) return "name-length-6";
  if (length === 5) return "name-length-5";
  return "name-length-short";
}

function getKanjiName(student: Student): { full?: string; last: string; first: string } {
  return {
    full: student.fullName && !student.firstName ? student.fullName : undefined,
    last: student.lastName,
    first: student.firstName
  };
}

function getKanaName(student: Student): { full?: string; last: string; first: string } {
  if (student.fullKana) {
    return { full: student.fullKana, last: "", first: "" };
  }

  return {
    last: student.lastKana || student.lastName,
    first: student.firstKana || student.firstName
  };
}

function joinNameParts(name: { full?: string; last: string; first: string }): string {
  return name.full || `${name.last}${name.first}`;
}

function NameDisplay({ student, mode }: { student: Student; mode: NameDisplayMode }) {
  const kanjiName = getKanjiName(student);
  const kanaName = getKanaName(student);
  const displayName = mode === "kanaOnly" ? kanaName : kanjiName;
  const lengthClass = getNameLengthClass(joinNameParts(displayName));
  const spacingClass = mode === "kanjiWithKana" ? "name-with-kana" : "name-without-kana";

  if (mode === "kanaOnly") {
    return (
      <span className={`full-name-text name-kana-only ${lengthClass}`}>
        {displayName.full ? (
          <span className="name-part">{displayName.full}</span>
        ) : (
          <>
            <span className="name-part">{displayName.last}</span>
            <span className="name-part">{displayName.first}</span>
          </>
        )}
      </span>
    );
  }

  if (displayName.full) {
    return (
      <span className={`full-name-text ${spacingClass} ${lengthClass}`}>
        {mode === "kanjiWithKana" && kanaName.full ? (
          <ruby className="name-part">
            {displayName.full}
            <rt>{kanaName.full}</rt>
          </ruby>
        ) : (
          <span className="name-part">{displayName.full}</span>
        )}
      </span>
    );
  }

  if (mode === "kanjiOnly") {
    return (
      <span className={`full-name-text name-without-kana ${lengthClass}`}>
        <span className="name-part">{displayName.last}</span>
        <span className="name-part">{displayName.first}</span>
      </span>
    );
  }

  return (
    <span className={`full-name-text name-with-kana ${lengthClass}`}>
      {student.lastKana ? (
        <ruby className="name-part">
          {displayName.last}
          <rt>{student.lastKana}</rt>
        </ruby>
      ) : (
        <span className="name-part">{displayName.last}</span>
      )}
      {student.firstKana ? (
        <ruby className="name-part">
          {displayName.first}
          <rt>{student.firstKana}</rt>
        </ruby>
      ) : (
        <span className="name-part">{displayName.first}</span>
      )}
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
  const numberColumnWidth = isTwoColumn
    ? Math.min(settings.layout.numberColumnWidth, 26)
    : settings.layout.numberColumnWidth;
  const nameColumnWidth = isTwoColumn
    ? Math.min(settings.layout.nameColumnWidth, 82)
    : hasManyChecks
      ? Math.min(settings.layout.nameColumnWidth, 94)
      : settings.layout.nameColumnWidth;
  const checkColumnWidth = isTwoColumn && hasManyChecks
    ? Math.min(settings.layout.checkColumnMinWidth, 13)
    : hasManyChecks
      ? Math.min(settings.layout.checkColumnMinWidth, 16)
      : settings.layout.checkColumnMinWidth;
  const hasRuby = settings.nameDisplayMode === "kanjiWithKana";
  const baseNameFontSize = hasRuby
    ? settings.layout.nameFontSize
    : settings.layout.nameFontSizeNoKana;
  const nameFontSize = isTwoColumn && hasManyChecks
    ? Math.min(baseNameFontSize, hasRuby ? 14.5 : 16)
    : isTwoColumn || hasManyChecks
      ? Math.min(baseNameFontSize, hasRuby ? 15 : 16.5)
      : baseNameFontSize;
  const genderColumnWidth = 38;
  const birthdayColumnWidth = 82;
  const groupColumnWidth = 40;
  const noteColumnWidth = 80;
  const fixedColumnsWidth =
    numberColumnWidth +
    nameColumnWidth +
    (visibleColumns.gender ? genderColumnWidth : 0) +
    (visibleColumns.birthday ? birthdayColumnWidth : 0) +
    (visibleColumns.group ? groupColumnWidth : 0) +
    (visibleColumns.note ? noteColumnWidth : 0);
  const fixedColumnStyle = (width: number) => ({ width: `${width}px` }) as CSSProperties;
  const checkColumnStyle = {
    width: checks.length > 0
      ? `max(${checkColumnWidth}px, calc((100% - ${fixedColumnsWidth}px) / ${checks.length}))`
      : `${checkColumnWidth}px`
  } as CSSProperties;
  const tableStyle = {
    "--number-column-width": `${numberColumnWidth}px`,
    "--name-column-width": `${nameColumnWidth}px`,
    "--check-column-min-width": `${checkColumnWidth}px`,
    "--check-column-width": checks.length > 0
      ? `max(${checkColumnWidth}px, calc((100% - ${fixedColumnsWidth}px) / ${checks.length}))`
      : `${checkColumnWidth}px`,
    "--name-font-size": `${nameFontSize}px`,
    "--name-font-size-5": `${Math.min(nameFontSize, hasRuby ? 15.2 : 16.5)}px`,
    "--name-font-size-6": `${Math.min(nameFontSize, hasRuby ? 14.4 : 15.5)}px`,
    "--name-font-size-long": `${Math.min(nameFontSize, hasRuby ? 13.4 : 14)}px`
  } as CSSProperties;

  return (
    <div className="table-block">
      {heading ? <div className="block-heading">{heading}</div> : null}
      <table className={`roster-table ${checks.length > 0 ? "has-checks" : "no-checks"}`} style={tableStyle}>
        <colgroup>
          <col className="number-col" style={fixedColumnStyle(numberColumnWidth)} />
          <col className="name-col" style={fixedColumnStyle(nameColumnWidth)} />
          {visibleColumns.gender ? <col className="gender-col" style={fixedColumnStyle(genderColumnWidth)} /> : null}
          {visibleColumns.birthday ? <col className="birthday-col" style={fixedColumnStyle(birthdayColumnWidth)} /> : null}
          {visibleColumns.group ? <col className="group-col" style={fixedColumnStyle(groupColumnWidth)} /> : null}
          {checks.map((check) => (
            <col className="check-col" style={checkColumnStyle} key={`check-col-${check}`} />
          ))}
          {visibleColumns.note ? <col className="note-col" style={fixedColumnStyle(noteColumnWidth)} /> : null}
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
                <NameDisplay student={student} mode={settings.nameDisplayMode} />
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
